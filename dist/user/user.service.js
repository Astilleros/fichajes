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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const encript_service_1 = require("../encript/encript.service");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    constructor(userModel, encript) {
        this.userModel = userModel;
        this.encript = encript;
    }
    async create(createUserDto) {
        const user = Object.assign({}, createUserDto);
        user.password = await this.encript.hashUserPassword(user.password);
        return await this.userModel.create(user);
    }
    async findOne(id) {
        return await this.userModel.findOne({ _id: id }).lean();
    }
    async update(id, updateUserDto) {
        const update = Object.assign({}, updateUserDto);
        if (update.password)
            update.password = await this.encript.hashUserPassword(update.password);
        return await this.userModel
            .findOneAndUpdate({ _id: id }, update, { new: true })
            .lean();
    }
    async remove(id) {
        return await this.userModel.findOneAndDelete({ _id: id }).lean();
    }
    async findUsername(username) {
        return await this.userModel.findOne({ username }, '+password').lean();
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        encript_service_1.EncriptService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map