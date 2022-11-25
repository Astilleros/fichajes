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
const files_service_1 = require("../files/files.service");
const checkin_service_1 = require("../checkin/checkin.service");
const sign_service_1 = require("../sign/sign.service");
const mode_enum_1 = require("./dto/mode.enum");
let WorkersService = class WorkersService {
    constructor(workerModel, calendarService, FilesService, userService, CheckinService, SignService) {
        this.workerModel = workerModel;
        this.calendarService = calendarService;
        this.FilesService = FilesService;
        this.userService = userService;
        this.CheckinService = CheckinService;
        this.SignService = SignService;
    }
    async create(createWorkerDto) {
        const createdWorker = new this.workerModel(createWorkerDto);
        const calendar = await this.calendarService.createCalendar({
            summary: `FicharFacil ${createdWorker.name}`,
            description: `Calendario creado por FicharFacil para el trabajador ${createdWorker.name}. Aqui registrará cada periodo trabajado mediante un evento. `,
            timeZone: 'Europe/Madrid',
        });
        const private_calendar = await this.calendarService.createCalendar({
            summary: `Private FicharFacil ${createdWorker.name}`,
            description: `Calendario creado por FicharFacil para el trabajador ${createdWorker.name}. Aquí se registraran los eventos mientras este en modo comando. `,
            timeZone: 'Europe/Madrid',
        });
        createdWorker.calendar = calendar.id;
        createdWorker.private_calendar = private_calendar.id;
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
        const w = await this.workerModel
            .findOne({ _id: worker_id, user: user._id })
            .exec();
        if (!w)
            throw new Error('Trabajador no encontrado');
        const events = await this.calendarService.filterEvents(w.calendar, start, end, 400);
        return events;
    }
    findOne(user_id, _id) {
        const worker = this.workerModel.findOne({ _id, user: user_id }).exec();
        return worker;
    }
    async update(user_id, _id, updateWorkerDto) {
        const worker = await this.workerModel.findById(_id);
        if (updateWorkerDto.mode !== worker.mode) {
            const editMode = await this.changeMode(user_id, worker._id, updateWorkerDto.mode);
            updateWorkerDto.mode = editMode.mode;
        }
        console.log('update mode', updateWorkerDto.mode);
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
        await this.calendarService.deleteCalendar(worker.private_calendar);
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
    async changeMode(user_id, worker_id, new_mode) {
        const w = await this.workerModel.findOne({
            _id: worker_id,
            user: user_id,
        });
        if (w.mode === new_mode)
            return w;
        if (new_mode === mode_enum_1.workerModes.none)
            await this.calendarService.unshareCalendar(w.calendar, w.email);
        if (new_mode === mode_enum_1.workerModes.place) {
            if (w.mode !== mode_enum_1.workerModes.none)
                await this.calendarService.unshareCalendar(w.calendar, w.email);
            await this.calendarService.shareCalendar(w.calendar, w.email, 'reader');
        }
        if (new_mode > mode_enum_1.workerModes.place) {
            if (w.mode === mode_enum_1.workerModes.place)
                await this.calendarService.unshareCalendar(w.calendar, w.email);
            await this.calendarService.shareCalendar(w.calendar, w.email, 'writer');
        }
        console.log('a', w.mode);
        w.mode = new_mode;
        console.log('b', w.mode);
        return await w.save();
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
            if (!base[start.getDate()])
                base[start.getDate()] = [];
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
                const s_h = e.start.dateTime.slice(11, 13);
                const e_h = e.end.dateTime.slice(11, 13);
                const s_m = e.start.dateTime.slice(14, 16);
                const e_m = e.end.dateTime.slice(14, 16);
                row[i] = `${s_h}:${s_m} - ${e_h}:${e_m}`;
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
    async getWorkerByCalendar(calendar) {
        const worker = await this.workerModel.findOne({ calendar }).exec();
        return worker;
    }
    async watchEvent(worker, e) {
        var _a, _b, _c;
        if (e.status === 'cancelled')
            return;
        if (((_a = e.creator) === null || _a === void 0 ? void 0 : _a.email.length) &&
            e.creator.email != worker.email &&
            e.creator.email != worker.calendar &&
            e.creator.email != worker.private_calendar) {
            return await this.calendarService.deleteEvent(worker.calendar, e.id);
        }
        if ((_b = e.start) === null || _b === void 0 ? void 0 : _b.date) {
            if (e.summary === '@vincular')
                return this.comandoVincular(worker, e);
            if (e.summary === '@desvincular')
                return this.comandoDesvincular(worker, e);
            if (e.summary === '@mes')
                return this.comandoMes(worker, e);
            if (e.summary === '@entrada')
                return this.comandoEntrada(worker, e);
            if (e.summary === '@salida')
                return this.comandoSalida(worker, e);
            if (e.summary === '@firmar')
                return this.comandoFirmar(worker, e);
        }
        if (worker.mode === mode_enum_1.workerModes.command &&
            ((_c = e.creator) === null || _c === void 0 ? void 0 : _c.email.length) &&
            e.creator.email != worker.calendar &&
            e.creator.email != worker.private_calendar) {
            return await this.calendarService.deleteEvent(worker.calendar, e.id);
        }
    }
    async comandoVincular(worker, e) {
        if (worker.status === status_enum_1.workerStatus.pending) {
            await this.update(worker.user, worker._id, {
                status: status_enum_1.workerStatus.linked,
            });
            await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: 'Vinculado corectamente',
            });
        }
        if (worker.status === status_enum_1.workerStatus.linked) {
            await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: 'Calendario ya vinculado.',
            });
        }
    }
    async comandoDesvincular(worker, e) {
        await this.unshareCalendar(worker.user, worker._id);
        await this.calendarService.patchEvent(worker.calendar, e.id, {
            summary: 'Calendario desvinculado',
        });
    }
    async comandoMes(worker, e) {
        const reference = new Date(e.start.date);
        const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
        const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);
        const pdf_data = await this.generatePdfToSign({
            _id: worker.user,
            username: '',
            email: '',
        }, worker._id, start.toISOString(), end.toISOString());
        const url = await this.FilesService.create({
            filename: `ficfac_${start.toISOString()}`,
            data: pdf_data,
            calendar: worker.calendar,
            event: e.id,
        });
        await this.calendarService.patchEvent(worker.calendar, e.id, {
            summary: 'Hoja generada',
            description: `Enlace de descarga de un uso: ${url}`,
        });
    }
    async comandoEntrada(worker, e) {
        const needCheckout = await this.CheckinService.findByWorker(worker._id);
        if (needCheckout) {
            return await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: '¿Olvidaste fichar la última salida? @checkout pendiente.',
                description: `Estas intentando fichar una nueva entrada sin haber cerrado el anterior registro de entrada. 
        Realiza antes un @checkout para poder hacer @checkin nuevamente.`,
            });
        }
        const date = new Date().toISOString();
        const checkin = await this.CheckinService.create({
            worker: worker._id,
            calendar: worker.calendar,
            date,
            event: e.id,
        });
        if (!checkin)
            throw new Error(`Imposible crear registro de entrada del trabajador: ${worker.name}`);
        await this.calendarService.patchEvent(worker.calendar, e.id, {
            summary: `Checkin abierto a las ${date}`,
            description: `Recuerda hacer @checkout para registrar la hora de finalización de periodo y registrar la jornada.`,
        });
        return checkin;
    }
    async comandoSalida(worker, e) {
        const checkin = await this.CheckinService.findByWorker(worker._id);
        if (!checkin) {
            return await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: '¿Olvidaste fichar la última entrada?',
                description: `Si olvidaste registrar la hora de comiendo de periodo con @checkin, sigue los siguientes pasos:
        Primero, registra el @checkin y haz el @checkout normalmente.
        Segundo, si no tienes el modo libre habilitado, haz click en el registro generado y envia un email a recursos humanos con el boton de envio de canvios.`,
            });
        }
        try {
            await this.calendarService.deleteEvent(worker.calendar, checkin.event);
        }
        catch (e) {
            console.log('Evento ya eliminado.' + checkin.event);
        }
        try {
            await this.calendarService.deleteEvent(worker.calendar, e.id);
        }
        catch (e) {
            console.log('Evento ya eliminado.' + e.id);
        }
        if (worker.mode === mode_enum_1.workerModes.command) {
            await this.calendarService.createEvent(worker.private_calendar, {
                summary: '',
                description: '',
                start: {
                    dateTime: checkin.date,
                },
                end: {
                    dateTime: new Date().toISOString(),
                },
                attendees: [
                    {
                        email: worker.calendar,
                    },
                ],
            });
        }
        else {
            await this.calendarService.createEvent(worker.calendar, {
                summary: '',
                description: '',
                start: {
                    dateTime: checkin.date,
                },
                end: {
                    dateTime: new Date().toISOString(),
                },
            });
        }
        await this.CheckinService.delete(checkin._id);
    }
    async comandoFirmar(worker, e) {
        var _a;
        if (!((_a = e.attachments) === null || _a === void 0 ? void 0 : _a.length)) {
            return await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: 'Olvidaste adjuntar el documento.',
                description: `Intentalo nuevamente comprobando que en la creación de levento se adjunta el archivo correspondiente. Puedes eliminar esta alerta.`,
            });
        }
        const reference = new Date(e.start.date);
        const month = new Date(reference.getFullYear(), reference.getMonth(), 1).toISOString();
        await this.SignService.create({
            user: worker.user,
            worker: worker._id,
            file: e.attachments[0].fileUrl,
            month,
            createdAt: new Date().toISOString(),
        });
        return await this.calendarService.patchEvent(worker.calendar, e.id, {
            summary: 'Documento enviado correctamente.',
            description: `Recibiras confirmación en cuanto se revise.`,
        });
    }
};
WorkersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(worker_entity_1.Worker.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        calendar_service_1.CalendarService,
        files_service_1.FilesService,
        user_service_1.UserService,
        checkin_service_1.CheckinService,
        sign_service_1.SignService])
], WorkersService);
exports.WorkersService = WorkersService;
const pad2z = (data) => {
    return String(data).padStart(2, '0');
};
//# sourceMappingURL=workers.service.js.map