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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const encript_service_1 = require("../encript/encript.service");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, encrip) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.encrip = encrip;
    }
    async validateUser(username, pass) {
        const user = await this.userService.findUsername(username);
        if (!user)
            return null;
        const valid = await this.encrip.comparePasswords(pass, user.password);
        if (!valid)
            return null;
        return user;
    }
    async generateAccessToken(user) {
        const payload = {
            username: user.username,
            _id: user._id,
            email: user.email,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        encript_service_1.EncriptService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map