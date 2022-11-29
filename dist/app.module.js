"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const workers_module_1 = require("./workers/workers.module");
const tasks_module_1 = require("./tasks/tasks.module");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const calendar_service_1 = require("./calendar/calendar.service");
const calendar_module_1 = require("./calendar/calendar.module");
const files_module_1 = require("./files/files.module");
const sign_module_1 = require("./sign/sign.module");
const checkin_module_1 = require("./checkin/checkin.module");
const stripe_module_1 = require("./stripe/stripe.module");
const config_1 = require("@nestjs/config");
const checkouts_module_1 = require("./stripe/checkouts/checkouts.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: __dirname + '/.env',
            }),
            mongoose_1.MongooseModule.forRoot('mongodb://127.0.0.1/fichajes_db'),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            workers_module_1.WorkersModule,
            tasks_module_1.TasksModule,
            calendar_module_1.CalendarsModule,
            files_module_1.FilesModule,
            sign_module_1.SignModule,
            checkin_module_1.CheckinModule,
            stripe_module_1.StripeModule,
            checkouts_module_1.CheckoutsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, calendar_service_1.CalendarService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map