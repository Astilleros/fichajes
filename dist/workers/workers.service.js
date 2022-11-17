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
exports.WorkersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const calendar_service_1 = require("../calendar/calendar.service");
const status_enum_1 = require("./dto/status.enum");
const worker_entity_1 = require("./entities/worker.entity");
const jspdf_1 = require("jspdf");
const jspdf_autotable_1 = require("jspdf-autotable");
const user_service_1 = require("../user/user.service");
let WorkersService = class WorkersService {
    constructor(workerModel, calendarService, userService) {
        this.workerModel = workerModel;
        this.calendarService = calendarService;
        this.userService = userService;
    }
    async create(createWorkerDto) {
        const createdWorker = new this.workerModel(createWorkerDto);
        const calendar = await this.calendarService.createCalendar({
            summary: `FicharFacil ${createdWorker.name}`,
            description: `Calendario creado por FicharFacil para el trabajador ${createdWorker.name}. Aqui registrará cada periodo trabajado mediante un evento. `,
            timeZone: 'Europe/Madrid',
        });
        createdWorker.calendar = calendar.id;
        await createdWorker.save();
        return createdWorker.toObject();
    }
    async findAll(user) {
        const workers = await this.workerModel
            .find({ user: user._id })
            .exec();
        return workers;
    }
    async filterEvents(user, worker_id, start, end) {
        let w = await this.workerModel
            .findOne({ _id: worker_id, user: user._id })
            .exec();
        if (!w)
            throw new Error('Trabajador no encontrado');
        const events = await this.calendarService.filterEvents(w.calendar, start, end, 400);
        if (w.status === status_enum_1.workerStatus.pending && events.length) {
            w = await this.workerModel.findOneAndUpdate({ _id: w._id }, { status: status_enum_1.workerStatus.linked }, { new: true });
        }
        return events;
    }
    findOne(user_id, _id) {
        const worker = this.workerModel.findOne({ _id, user: user_id }).exec();
        return worker;
    }
    update(user_id, _id, updateWorkerDto) {
        return this.workerModel
            .findOneAndUpdate({ _id, user: user_id }, updateWorkerDto, { new: true })
            .exec();
    }
    async remove(user_id, _id) {
        const worker = await this.workerModel
            .findOneAndDelete({ _id, user: user_id })
            .exec();
        if (!worker)
            throw new Error('Trabajador no encontrado.');
        if (worker.status === status_enum_1.workerStatus.linked ||
            worker.status === status_enum_1.workerStatus.pending)
            await this.calendarService.unshareCalendar(worker.calendar, worker.email);
        await this.calendarService.deleteCalendar(worker.calendar);
        return worker;
    }
    async shareCalendar(user_id, worker_id) {
        const worker = await this.workerModel.findOne({
            _id: worker_id,
            user: user_id,
        });
        if (worker.status !== status_enum_1.workerStatus.unlinked)
            return worker;
        if (!(worker === null || worker === void 0 ? void 0 : worker.calendar))
            throw new Error('Error inesperado en el calendario.');
        if (!(worker === null || worker === void 0 ? void 0 : worker.email))
            throw new Error('Trabajador no tiene email asignado.');
        await this.calendarService.shareCalendar(worker.calendar, worker.email);
        const now = new Date().toISOString();
        await this.calendarService.createEvent(worker.calendar, {
            summary: 'Fichar Facil: Crea tu primer registro para finalizar la verificación.',
            description: `
Si puedes ver este evento ¡Ya estas en el último paso!
Elimina este mensaje y empieza a registrar tu jornada añadiendo eventos en este calendario.
En la web "www.ficharfacil.com" encontraras una sección con manuales, videos y preguntas frecuentes.
      `,
            start: { dateTime: now },
            end: { dateTime: now },
        });
        const updated = await this.workerModel.findOneAndUpdate({ _id: worker._id }, { status: 1 }, { new: true });
        return updated;
    }
    async unshareCalendar(user_id, worker_id) {
        const worker = await this.workerModel.findOne({
            _id: worker_id,
            user: user_id,
        });
        if (!(worker === null || worker === void 0 ? void 0 : worker.calendar))
            throw new Error('Trabajador no tiene email vinculado');
        await this.calendarService.unshareCalendar(worker.calendar, worker.email);
        const updated = await this.workerModel.findOneAndUpdate({ _id: worker._id }, { status: 0 }, { new: true });
        return updated;
    }
    async generatePdfToSign(userJwt, worker_id, start, end) {
        console.log(start, end);
        const user = await this.userService.findOne(userJwt._id);
        const worker = await this.findOne(userJwt._id, worker_id);
        const events = await this.filterEvents(userJwt, worker_id, new Date(start).toISOString(), new Date(end).toISOString());
        console.log(events.length);
        const doc = new jspdf_1.jsPDF({});
        (0, jspdf_autotable_1.default)(doc, {
            head: [],
            body: [
                [
                    'Empresa: ' + user.empresa,
                    'CIF: ' + user.cif,
                    'Sede social: ' + user.sede,
                ],
                [
                    'Trabajador: ' + worker.name,
                    'Dni: ' + worker.dni,
                    'Seguridad social: ' + worker.seguridad_social,
                ],
            ],
            startY: 5,
        });
        const body = [];
        const days = Math.round((new Date(end).getTime() / 1000 - new Date(start).getTime() / 1000) /
            (24 * 60 * 60));
        console.log(days);
        const base = {};
        let cols_events = 0;
        let total_hours = 0;
        let total_days = 0;
        for (let i = new Date(start).getDate(); i <= days; i++) {
            base[i] = [];
        }
        console.log(JSON.stringify(base, null, 2));
        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (!e.start.dateTime || !e.end.dateTime)
                continue;
            const start = new Date(e.start.dateTime);
            base[start.getDate()].push(e);
            if (base[start.getDate()].length > cols_events)
                cols_events = base[start.getDate()].length;
        }
        console.log(cols_events);
        Object.keys(base).map((key) => {
            const events = base[key];
            if (events.length === 0)
                return;
            total_days++;
            let hours = 0;
            const row = [];
            for (let i = 0; i < cols_events; i++) {
                const e = events[i];
                if (!e || !e.start || !e.end) {
                    row[i] = '';
                    continue;
                }
                const start_au = new Date(e.start.dateTime);
                const end_au = new Date(e.end.dateTime);
                row[i] = `${pad2z(start_au.getHours())}:${pad2z(start_au.getMinutes())} - ${pad2z(end_au.getHours())}:${pad2z(end_au.getMinutes())}`;
                hours += (end_au.getTime() - start_au.getTime()) / (60 * 60 * 1000);
                total_hours +=
                    (end_au.getTime() - start_au.getTime()) / (60 * 60 * 1000);
            }
            body.push([pad2z(key), ...row, hours]);
        });
        const row = [];
        for (let i = 0; i < cols_events; i++) {
            row[i] = i;
        }
        (0, jspdf_autotable_1.default)(doc, {
            head: [['Día', ...row, 'Horas']],
            body,
            startY: doc.lastAutoTable.finalY,
            theme: 'grid',
        });
        (0, jspdf_autotable_1.default)(doc, {
            head: [],
            body: [
                ['Total horas: ' + total_hours, 'Total dias: ' + total_days],
                ['Firma Trabajador', 'Empresa'],
            ],
            startY: doc.lastAutoTable.finalY,
        });
        return doc.output();
    }
};
WorkersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(worker_entity_1.Worker.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        calendar_service_1.CalendarService,
        user_service_1.UserService])
], WorkersService);
exports.WorkersService = WorkersService;
const pad2z = (data) => {
    return String(data).padStart(2, '0');
};
//# sourceMappingURL=workers.service.js.map