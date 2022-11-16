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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const AuthUser_decorator_1 = require("../auth/decorators/AuthUser.decorator");
const jwtPayload_dto_1 = require("../auth/dto/jwtPayload.dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(user, createTaskDto) {
        return this.tasksService.create(user, createTaskDto);
    }
    findAll(user) {
        return this.tasksService.findAll(user._id);
    }
    findOne(user, id) {
        return this.tasksService.findOne(user._id, id);
    }
    update(user, id, updateTaskDto) {
        return this.tasksService.update(user._id, id, updateTaskDto);
    }
    remove(user, id) {
        return this.tasksService.remove(user._id, id);
    }
    addWorker(user, id, worker_id) {
        return this.tasksService.addWorker(user._id, id, worker_id);
    }
    deleteWorker(user, id, worker_id) {
        return this.tasksService.deleteWorker(user._id, id, worker_id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('/:id/worker/:worker_id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('worker_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "addWorker", null);
__decorate([
    (0, common_1.Delete)('/:id/worker/:worker_id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('worker_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "deleteWorker", null);
TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
exports.TasksController = TasksController;
//# sourceMappingURL=tasks.controller.js.map