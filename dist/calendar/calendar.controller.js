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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const workers_service_1 = require("../workers/workers.service");
let CalendarController = class CalendarController {
    constructor(CalendarService, workersService) {
        this.CalendarService = CalendarService;
        this.workersService = workersService;
    }
    async watch(req) {
        var _a;
        const status = req.headers['x-goog-resource-state'];
        console.log('1- WEBHOOK WATCH, status: ', status);
        if (status != 'exists')
            return;
        console.log(req.headers['x-goog-channel-id']);
        const calendarId = req.headers['x-goog-channel-id']
            .replace('-', '@')
            .replace(/\_/g, '.');
        console.log('2- replaced calendarId: ', calendarId);
        const worker = await this.workersService.getWorkerByCalendar(calendarId);
        if (!worker)
            throw new Error('No encuentra en worker');
        if (worker.locked === true)
            throw new Error('Syncronización de trabajador bloqueada.');
        else {
            worker.locked = true;
            await worker.save();
        }
        console.log('3- worker & mode: ', worker.name, worker.mode, worker.locked);
        const new_events = await this.CalendarService.getChanges(calendarId, worker.sync);
        let last_updated = 0;
        for (let i = 0; i < new_events.length; i++) {
            const e = new_events[i];
            console.log('4- evento: ', e.summary, e.start, e.end, Object.keys(e).length);
            const updated = new Date((_a = e.updated) !== null && _a !== void 0 ? _a : e.created).getTime();
            if (last_updated < updated)
                last_updated = updated;
            await this.workersService.watchEvent(worker, e);
        }
        const sync = new Date(last_updated).toISOString();
        console.log('5- new sync from date: ', sync);
        await this.workersService.update(worker.user, worker._id, {
            sync,
            locked: false,
        });
    }
    async list() {
        const calendars = await this.CalendarService.getCalendars();
        for (let i = 0; i < calendars.length; i++) {
            const c = calendars[i];
            c.shared = await this.CalendarService.getSharedAccounts(c.id);
            c.user = await this.workersService.getWorkerByCalendar(c.id);
        }
        return calendars;
    }
    async deleteCalendar(calendarId) {
        return await this.CalendarService.deleteCalendar(calendarId);
    }
    async deleteAcl(calendarId, aclId) {
        return await this.CalendarService.deleteAcl(calendarId, aclId);
    }
};
__decorate([
    (0, common_1.Post)('watch'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "watch", null);
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':calendarId'),
    __param(0, (0, common_1.Param)('calendarId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "deleteCalendar", null);
__decorate([
    (0, common_1.Delete)('acl/:calendarId/:aclId'),
    __param(0, (0, common_1.Param)('calendarId')),
    __param(1, (0, common_1.Param)('aclId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "deleteAcl", null);
CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService,
        workers_service_1.WorkersService])
], CalendarController);
exports.CalendarController = CalendarController;
//# sourceMappingURL=calendar.controller.js.map