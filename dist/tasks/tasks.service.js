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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const calendar_service_1 = require("../calendar/calendar.service");
const workers_service_1 = require("../workers/workers.service");
const task_entity_1 = require("./entities/task.entity");
let TasksService = class TasksService {
    constructor(taskModel, workerService, calendarService) {
        this.taskModel = taskModel;
        this.workerService = workerService;
        this.calendarService = calendarService;
    }
    async create(user, createTaskDto) {
        const createdTask = new this.taskModel(Object.assign(Object.assign({}, createTaskDto), { user: user._id }));
        const calendar = await this.calendarService.createCalendar({
            summary: `FicharFacil ${createdTask.name}`,
            description: `Calendario creado por FicharFacil para el puesto de trabajo ${createdTask.name}. Aquí registrará cada periodo a trabajar por cada trabajador. `,
            timeZone: 'Europe/Madrid',
        });
        createdTask.calendar = calendar.id;
        await createdTask.save();
        if (user.email)
            await this.calendarService.shareCalendar(createdTask.calendar, user.email);
        return createdTask.save();
    }
    findAll(user_id) {
        return this.taskModel.find({ user: user_id }).exec();
    }
    findOne(user_id, _id) {
        return this.taskModel.findOne({ _id, user: user_id }).exec();
    }
    update(user_id, _id, updateTaskDto) {
        return this.taskModel
            .findOneAndUpdate({ _id, user: user_id }, updateTaskDto, { new: true })
            .exec();
    }
    remove(user_id, _id) {
        return this.taskModel.findOneAndDelete({ _id, user: user_id }).exec();
    }
    async addWorker(user_id, _id, worker_id) {
        const validWorker = await this.workerService.findOne(user_id, worker_id);
        if (!(validWorker === null || validWorker === void 0 ? void 0 : validWorker.email))
            throw new Error('Intentando añadir trabajador no vinculado.');
        const taskUpdated = await this.taskModel
            .findOneAndUpdate({ _id, user: user_id }, { $push: { workers: worker_id } }, { new: true })
            .exec();
        await this.calendarService.shareCalendar(taskUpdated.calendar, validWorker.email);
        return taskUpdated;
    }
    async deleteWorker(user_id, task_id, worker_id) {
        const validWorker = await this.workerService.findOne(user_id, worker_id);
        if (!validWorker)
            throw new Error('Intentando eliminar trabajador no vinculado.');
        const taskUpdated = await this.taskModel
            .findOneAndUpdate({ _id: task_id, user: user_id }, { $pull: { workers: worker_id } }, { new: true })
            .exec();
        await this.calendarService.unshareCalendar(taskUpdated.calendar, validWorker.email);
        return taskUpdated;
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_entity_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        workers_service_1.WorkersService,
        calendar_service_1.CalendarService])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map