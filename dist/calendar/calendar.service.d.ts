import { calendar_v3 } from 'googleapis';
export declare class CalendarService {
    private client;
    constructor();
    getCalendars(): Promise<calendar_v3.Schema$CalendarListEntry[]>;
    watchCalendarEvents(calendarId: calendar_v3.Schema$Calendar['id']): Promise<import("gaxios").GaxiosResponse<calendar_v3.Schema$Channel>>;
    createCalendar(calendarData: calendar_v3.Schema$Calendar): Promise<calendar_v3.Schema$Calendar>;
    shareCalendar(calendarId: string, googleAccount: string, role?: 'writer' | 'reader'): Promise<string>;
    getSharedAccounts(calendarId: string): Promise<calendar_v3.Schema$AclRule[]>;
    unshareCalendar(calendarId: string, googleAccount: string): Promise<void>;
    deleteAcl(calendarId: string, aclId: string): Promise<import("gaxios").GaxiosResponse<void>>;
    deleteCalendar(calendarId: string): Promise<void>;
    clearCalendarList(): Promise<void>;
    getCalendarUrl(calendarId: string): string;
    getEventId(calendarId: string, eventId: string): Promise<calendar_v3.Schema$Event>;
    createEvent(calendarId: string, eventData: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    getChanges(calendarId: string, updatedMin: string): Promise<calendar_v3.Schema$Event[]>;
    filterEvents(calendarId: string, timeMin?: string, timeMax?: string, maxResults?: number): Promise<calendar_v3.Schema$Event[]>;
    deleteEvent(calendarId: string, eventId: string): Promise<void>;
    updateEvent(calendarId: string, eventId: string, eventData: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    patchEvent(calendarId: string, eventId: string, eventData: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
}
