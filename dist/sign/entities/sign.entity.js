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
exports.SignSchema = exports.Sign = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ExposeId_decorator_1 = require("../../core/decorators/ExposeId.decorator");
let Sign = class Sign {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId }),
    (0, ExposeId_decorator_1.ExposeId)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sign.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    (0, ExposeId_decorator_1.ExposeId)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sign.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Worker', required: true }),
    (0, ExposeId_decorator_1.ExposeId)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sign.prototype, "worker", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sign.prototype, "file", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sign.prototype, "month", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Sign.prototype, "createdAt", void 0);
Sign = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false })
], Sign);
exports.Sign = Sign;
exports.SignSchema = mongoose_1.SchemaFactory.createForClass(Sign);
//# sourceMappingURL=sign.entity.js.map