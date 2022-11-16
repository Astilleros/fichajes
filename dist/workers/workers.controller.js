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
exports.WorkersController = void 0;
const common_1 = require("@nestjs/common");
const workers_service_1 = require("./workers.service");
const create_worker_dto_1 = require("./dto/create-worker.dto");
const update_worker_dto_1 = require("./dto/update-worker.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const jwtPayload_dto_1 = require("../auth/dto/jwtPayload.dto");
const AuthUser_decorator_1 = require("../auth/decorators/AuthUser.decorator");
let WorkersController = class WorkersController {
    constructor(workersService) {
        this.workersService = workersService;
    }
    create(user, createWorkerDto) {
        return this.workersService.create(Object.assign(Object.assign({}, createWorkerDto), { user: user._id }));
    }
    findAll(user) {
        return this.workersService.findAll(user);
    }
    filterEvents(user, worker_id, start, end) {
        return this.workersService.filterEvents(user, worker_id, start, end);
    }
    findOne(user, id) {
        return this.workersService.findOne(user._id, id);
    }
    update(user, id, updateWorkerDto) {
        return this.workersService.update(user._id, id, updateWorkerDto);
    }
    remove(user, id) {
        return this.workersService.remove(user._id, id);
    }
    shareCalendar(user, id) {
        return this.workersService.shareCalendar(user._id, id);
    }
    unshareCalendar(user, id) {
        return this.workersService.unshareCalendar(user._id, id);
    }
    generatePdf(user, worker_id, start, end) {
        return this.workersService.generatePdfToSign(user, worker_id, start, end);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload,
        create_worker_dto_1.CreateWorkerDto]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('worker_id')),
    __param(2, (0, common_1.Query)('start')),
    __param(3, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "filterEvents", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String, update_worker_dto_1.UpdateWorkerDto]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/share/:id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "shareCalendar", null);
__decorate([
    (0, common_1.Get)('/unshare/:id'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "unshareCalendar", null);
__decorate([
    (0, common_1.Get)('/generate/pdf'),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="package.pdf"'),
    __param(0, (0, AuthUser_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('worker_id')),
    __param(2, (0, common_1.Query)('start')),
    __param(3, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwtPayload_dto_1.JwtPayload, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkersController.prototype, "generatePdf", null);
WorkersController = __decorate([
    (0, common_1.Controller)('workers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workers_service_1.WorkersService])
], WorkersController);
exports.WorkersController = WorkersController;
//# sourceMappingURL=workers.controller.js.map