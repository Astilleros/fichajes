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
const workers_service_1 = require("../workers/workers.service");
const calendar_service_1 = require("./calendar.service");
let CalendarController = class CalendarController {
    constructor(calendarService, workersService) {
        this.calendarService = calendarService;
        this.workersService = workersService;
    }
    async watch(req) {
        const status = req.headers['x-goog-resource-state'];
        if (status != 'exists')
            return;
        console.log('status', status);
        console.log(req.headers['x-goog-channel-id']);
        const calendarId = req.headers['x-goog-channel-id']
            .replace('-', '@')
            .replace(/\_/g, '.');
        console.log('replaced ', req.headers['x-goog-channel-id']);
        const worker = await this.workersService.getWorkerByCalendar(calendarId);
        if (!worker)
            throw new Error('No encuentra en worker');
        console.log('worker', worker);
        const sync = new Date().toISOString();
        console.log('sync', sync);
        const new_events = await this.calendarService.getChanges(calendarId, worker.sync);
        for (let i = 0; i < new_events.length; i++) {
            const e = new_events[i];
            console.log(e);
            this.workersService.watchEvent(worker, e);
        }
        await this.workersService.update(worker.user, worker._id, { sync });
    }
};
__decorate([
    (0, common_1.Post)('watch'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "watch", null);
CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService,
        workers_service_1.WorkersService])
], CalendarController);
exports.CalendarController = CalendarController;
//# sourceMappingURL=calendar.controller.js.map