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
exports.WorkerSchema = exports.Worker = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ExposeId_decorator_1 = require("../../core/decorators/ExposeId.decorator");
const mode_enum_1 = require("../dto/mode.enum");
const status_enum_1 = require("../dto/status.enum");
let Worker = class Worker {
};
__decorate([
    (0, ExposeId_decorator_1.ExposeId)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Worker.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    (0, ExposeId_decorator_1.ExposeId)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Worker.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Worker.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Worker.prototype, "dni", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Worker.prototype, "seguridad_social", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Worker.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Worker.prototype, "mobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Worker.prototype, "calendar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Worker.prototype, "private_calendar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: status_enum_1.workerStatus.unlinked }),
    __metadata("design:type", Number)
], Worker.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Date)
], Worker.prototype, "sync", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: mode_enum_1.workerModes, default: mode_enum_1.workerModes.none }),
    __metadata("design:type", Number)
], Worker.prototype, "mode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Worker.prototype, "locked", void 0);
Worker = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false })
], Worker);
exports.Worker = Worker;
exports.WorkerSchema = mongoose_1.SchemaFactory.createForClass(Worker);
//# sourceMappingURL=worker.entity.js.map