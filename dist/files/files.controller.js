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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const files_service_1 = require("./files.service");
const calendar_service_1 = require("../calendar/calendar.service");
const mongoose_1 = require("mongoose");
let FilesController = class FilesController {
    constructor(filesService, calendarService) {
        this.filesService = filesService;
        this.calendarService = calendarService;
    }
    async findOne(res, _id) {
        const file = await this.filesService.findById(_id);
        if (!file)
            return;
        await this.calendarService.deleteEvent(file.calendar, file.event);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.filename + '.pdf'}"`,
        });
        return res.send(file.data);
    }
};
__decorate([
    (0, common_1.Get)(':_id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "findOne", null);
FilesController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService,
        calendar_service_1.CalendarService])
], FilesController);
exports.FilesController = FilesController;
//# sourceMappingURL=files.controller.js.map