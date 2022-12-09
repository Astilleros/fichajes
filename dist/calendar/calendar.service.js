"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const googleapis_1 = require("googleapis");
const config_1 = require("./config");
const common_1 = require("@nestjs/common");
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY = config_1.default.googleCalendar.private_key;
const GOOGLE_CLIENT_EMAIL = config_1.default.googleCalendar.client_email;
let CalendarService = class CalendarService {
    constructor() {
        const auth = new googleapis_1.google.auth.JWT(GOOGLE_CLIENT_EMAIL, undefined, GOOGLE_PRIVATE_KEY, SCOPES);
        this.client = googleapis_1.google.calendar({
            version: 'v3',
            auth,
        });
    }
    async getCalendars() {
        const response = await this.client.calendarList.list();
        return response.data.items;
    }
    async watchCalendarEvents(calendarId) {
        const watchResponse = await this.client.events.watch({
            requestBody: {
                id: calendarId.replace('@', '-').replace(/\./g, '_'),
                type: 'web_hook',
                address: `https://ficfac.app/api/calendar/watch`,
            },
            calendarId,
        });
        return watchResponse;
    }
    async createCalendar(calendarData) {
        const requestBody = Object.assign(Object.assign({}, calendarData), { kind: 'calendar#calendarListEntry' });
        const response = await this.client.calendars.insert({ requestBody });
        await this.watchCalendarEvents(response.data.id);
        return response.data;
    }
    async shareCalendar(calendarId, googleAccount, role = 'writer') {
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
    async getSharedAccounts(calendarId) {
        const all = await this.client.acl.list({ calendarId });
        return all.data.items;
    }
    async unshareCalendar(calendarId, googleAccount) {
        const list_acl = await this.getSharedAccounts(calendarId);
        const acl = list_acl === null || list_acl === void 0 ? void 0 : list_acl.filter((acl) => acl.scope.value === googleAccount);
        if (!(acl === null || acl === void 0 ? void 0 : acl.length))
            return;
        await this.client.acl.delete({
            calendarId,
            ruleId: acl[0].id,
        });
        return;
    }
    async deleteAcl(calendarId, aclId) {
        const list_acl = await this.getSharedAccounts(calendarId);
        if (!list_acl.length)
            return;
        return await this.client.acl.delete({
            calendarId,
            ruleId: aclId,
        });
    }
    async deleteCalendar(calendarId) {
        const response = await this.client.calendars.delete({ calendarId });
        return response.data;
    }
    async clearCalendarList() {
        const calendars = await this.getCalendars();
        if (!(calendars === null || calendars === void 0 ? void 0 : calendars.length))
            return;
        for (let i = 0; i < calendars.length; i++) {
            const calendar = calendars[i];
            if (!calendar.id)
                continue;
            await this.deleteCalendar(calendar.id);
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
    getCalendarUrl(calendarId) {
        return `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`;
    }
    async getEventId(calendarId, eventId) {
        try {
            const response = await this.client.events.get({
                calendarId,
                eventId,
            });
            return response.data;
        }
        catch (e) {
            return null;
        }
    }
    async createEvent(calendarId, eventData) {
        const requestBody = Object.assign(Object.assign({}, eventData), { kind: 'calendar#calendarListEntry' });
        const response = await this.client.events.insert({
            calendarId,
            requestBody,
        });
        return response.data;
    }
    async getChanges(calendarId, updatedMin) {
        const options = {
            calendarId,
            updatedMin: updatedMin.toISOString(),
            singleEvents: false,
            showDeleted: false,
            showHiddenInvitations: false,
        };
        const response = await this.client.events.list(options);
        return response.data.items;
    }
    async filterEvents(calendarId, timeMin, timeMax, maxResults) {
        const options = {
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
    async deleteEvent(calendarId, eventId) {
        const response = await this.client.events.delete({ calendarId, eventId });
        return response.data;
    }
    async updateEvent(calendarId, eventId, eventData) {
        const requestBody = Object.assign(Object.assign({}, eventData), { kind: 'calendar#calendarListEntry' });
        const response = await this.client.events.update({
            calendarId,
            eventId,
            requestBody,
        });
        return response.data;
    }
    async patchEvent(calendarId, eventId, eventData) {
        const requestBody = Object.assign(Object.assign({}, eventData), { kind: 'calendar#calendarListEntry' });
        const response = await this.client.events.patch({
            calendarId,
            eventId,
            requestBody,
        });
        return response.data;
    }
};
CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CalendarService);
exports.CalendarService = CalendarService;
//# sourceMappingURL=calendar.service.js.map