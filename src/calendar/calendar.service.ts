/* eslint-disable prettier/prettier */
import { google, calendar_v3 } from 'googleapis';
import config from './config';
import { Injectable } from '@nestjs/common';


const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY = config.googleCalendar.private_key;
const GOOGLE_CLIENT_EMAIL = config.googleCalendar.client_email;

@Injectable()
export class CalendarService {
  private client: calendar_v3.Calendar;

  constructor() {
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      SCOPES,
    );
    this.client = google.calendar({
      version: 'v3',
      auth,
    });
  }

  // CALENDARIOS
  async getCalendars() {
    const response = await this.client.calendarList.list();
    return response.data;
  }

  async createCalendar(calendarData: calendar_v3.Schema$Calendar) {
    const requestBody = { ...calendarData, kind: 'calendar#calendarListEntry' };
    const response = await this.client.calendars.insert({ requestBody });
    return response.data;
  }

  async shareCalendar(
    calendarId: string,
    googleAccount: string,
    role: 'writer' | 'reader' = 'writer',
  ) {
    await this.client.acl.insert({
      calendarId,
      requestBody: {
        role,
        scope: {
          type: 'user',
          value: googleAccount,
        },
        kind: 'calendar#aclRule',
      },
    });

    return this.getCalendarUrl(calendarId);
  }

  async getSharedAccounts(calendarId: string) {
    const all = await this.client.acl.list({ calendarId });
    const response = all.data.items?.filter((i: any) => i.role != 'owner');
    return response;
  }

  async unshareCalendar(calendarId: string, googleAccount: string) {
    const list_acl = await this.getSharedAccounts(calendarId);
    const acl = list_acl?.filter(
      (acl: any) => acl.scope.value === googleAccount,
    );
    if (!acl?.length) return;
    await this.client.acl.delete({
      calendarId,
      ruleId: acl[0].id,
    });
    return;
  }

  async deleteCalendar(calendarId: string) {
    const response = await this.client.calendars.delete({ calendarId });
    return response.data;
  }

  async clearCalendarList() {
    const calendars = await this.getCalendars();
    if (!calendars?.items?.length) return;
    for (let i = 0; i < calendars.items.length; i++) {
      const calendar = calendars.items[i];
      if (!calendar.id) continue;
      await this.deleteCalendar(calendar.id);
      await new Promise((res: any) => setTimeout(res, 1000));
    }
  }

  getCalendarUrl(calendarId: string) {
    return `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`;
  }

  // EVENTOS
  async getEventId(calendarId: string, eventId: string) {
    try {
      const response = await this.client.events.get({
        calendarId,
        eventId,
      });
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createEvent(calendarId: string, eventData: calendar_v3.Schema$Event) {
    const requestBody = { ...eventData, kind: 'calendar#calendarListEntry' };
    const response = await this.client.events.insert({
      calendarId,
      requestBody,
    });
    return response.data;
  }

  async filterEvents(
    calendarId: string,
    timeMin?: string,
    timeMax?: string,
    maxResults?: number,
  ) {
    const options: calendar_v3.Params$Resource$Events$List = {
      calendarId,
      maxResults,
      timeMax,
      timeMin,
      singleEvents: true,
      orderBy: 'startTime',
    };
    const response = await this.client.events.list(options);
    return response.data.items;
  }

  async deleteEvent(calendarId: string, eventId: string) {
    const response = await this.client.events.delete({ calendarId, eventId });
    return response.data;
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    eventData: calendar_v3.Schema$Event,
  ) {
    const requestBody = { ...eventData, kind: 'calendar#calendarListEntry' };
    const response = await this.client.events.update({
      calendarId,
      eventId,
      requestBody,
    });
    return response.data;
  }
}
