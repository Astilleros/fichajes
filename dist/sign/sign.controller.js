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
exports.SignController = void 0;
const common_1 = require("@nestjs/common");
const sign_service_1 = require("./sign.service");
const create_sign_dto_1 = require("./dto/create-sign.dto");
const update_sign_dto_1 = require("./dto/update-sign.dto");
let SignController = class SignController {
    constructor(signService) {
        this.signService = signService;
    }
    create(createSignDto) {
        return this.signService.create(createSignDto);
    }
    findAll() {
        return this.signService.findAll();
    }
    findOne(id) {
        return this.signService.findOne(+id);
    }
    update(id, updateSignDto) {
        return this.signService.update(+id, updateSignDto);
    }
    remove(id) {
        return this.signService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sign_dto_1.CreateSignDto]),
    __metadata("design:returntype", void 0)
], SignController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SignController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SignController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sign_dto_1.UpdateSignDto]),
    __metadata("design:returntype", void 0)
], SignController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SignController.prototype, "remove", null);
SignController = __decorate([
    (0, common_1.Controller)('sign'),
    __metadata("design:paramtypes", [sign_service_1.SignService])
], SignController);
exports.SignController = SignController;
//# sourceMappingURL=sign.controller.js.map