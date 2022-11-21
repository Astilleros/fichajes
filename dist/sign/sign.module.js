"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignModule = void 0;
const common_1 = require("@nestjs/common");
const sign_service_1 = require("./sign.service");
const sign_controller_1 = require("./sign.controller");
let SignModule = class SignModule {
};
SignModule = __decorate([
    (0, common_1.Module)({
        controllers: [sign_controller_1.SignController],
        providers: [sign_service_1.SignService]
    })
], SignModule);
exports.SignModule = SignModule;
//# sourceMappingURL=sign.module.js.map