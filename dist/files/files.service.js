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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const files_entity_1 = require("./entities/files.entity");
let FilesService = class FilesService {
    constructor(FilesModel) {
        this.FilesModel = FilesModel;
    }
    async create(data) {
        const file = new this.FilesModel(data);
        await file.save();
        return `https://ficfac.app/api/files/${file === null || file === void 0 ? void 0 : file._id}`;
    }
    async findById(_id) {
        const file = await this.FilesModel.findOne({ _id }).exec();
        if (!file)
            return file;
        await this.FilesModel.deleteOne({ _id });
        return file;
    }
};
FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(files_entity_1.Files.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FilesService);
exports.FilesService = FilesService;
//# sourceMappingURL=files.service.js.map