"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkersModule = void 0;
const common_1 = require("@nestjs/common");
const workers_service_1 = require("./workers.service");
const workers_controller_1 = require("./workers.controller");
const mongoose_1 = require("@nestjs/mongoose");
const worker_entity_1 = require("./entities/worker.entity");
const calendar_service_1 = require("../calendar/calendar.service");
const user_module_1 = require("../user/user.module");
const files_module_1 = require("../files/files.module");
const checkin_module_1 = require("../checkin/checkin.module");
const sign_module_1 = require("../sign/sign.module");
let WorkersModule = class WorkersModule {
};
WorkersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: worker_entity_1.Worker.name, schema: worker_entity_1.WorkerSchema }]),
            user_module_1.UserModule,
            files_module_1.FilesModule,
            checkin_module_1.CheckinModule,
            sign_module_1.SignModule,
        ],
        controllers: [workers_controller_1.WorkersController],
        providers: [workers_service_1.WorkersService, calendar_service_1.CalendarService],
        exports: [workers_service_1.WorkersService],
    })
], WorkersModule);
exports.WorkersModule = WorkersModule;
//# sourceMappingURL=workers.module.js.map