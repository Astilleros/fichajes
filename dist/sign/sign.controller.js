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
let SignController = class SignController {
    constructor(signService) {
        this.signService = signService;
    }
    create(createSignDto) {
        return this.signService.create(createSignDto);
    }
    findById(id) {
        return this.signService.findById(id);
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
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SignController.prototype, "findById", null);
SignController = __decorate([
    (0, common_1.Controller)('sign'),
    __metadata("design:paramtypes", [sign_service_1.SignService])
], SignController);
exports.SignController = SignController;
//# sourceMappingURL=sign.controller.js.map