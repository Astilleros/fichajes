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
const luxon_1 = require("luxon");
luxon_1.Settings.defaultZone = "Europe/Madrid";
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
            summary: `FicFac: ${createdWorker.name}`,
            description: `Calendario creado por FicharFacil para el trabajador ${createdWorker.name}. Aqui registrará cada periodo trabajado mediante un evento. `,
            timeZone: 'Europe/Madrid',
        });
        const private_calendar = await this.calendarService.createCalendar({
            summary: `*FicFac*: ${createdWorker.name}`,
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
        if (new_mode === mode_enum_1.workerModes.open) {
            if (w.mode === mode_enum_1.workerModes.place)
                await this.calendarService.unshareCalendar(w.calendar, w.email);
            await this.calendarService.shareCalendar(w.calendar, w.email, 'writer');
        }
        w.mode = new_mode;
        return await w.save();
    }
    async generatePdfToSign(jwt, worker_id, start, end) {
        const dateStart = luxon_1.DateTime.fromISO(start);
        const dateEnd = luxon_1.DateTime.fromISO(end);
        const user = await this.userService.findOne(jwt._id);
        const worker = await this.findOne(jwt._id, worker_id);
        const events = await this.filterEvents(jwt, worker_id, dateStart.toISO(), dateEnd.toISO());
        const doc = new jspdf_1.jsPDF({});
        (0, jspdf_autotable_1.default)(doc, {
            head: [['Trabajador', '', '']],
            body: [
                [
                    'Nombre: ' + worker.name,
                    'Dni: ' + worker.dni,
                    'Seguridad social: ' + worker.seguridad_social,
                ],
            ],
            startY: 6,
            theme: 'grid',
        });
        (0, jspdf_autotable_1.default)(doc, {
            head: [['Empresa', '', '']],
            body: [
                ['Nombre: ' + user.empresa, 'CIF: ' + user.cif, 'Sede: ' + user.sede]
            ],
            startY: doc.lastAutoTable.finalY + 1,
            theme: 'grid',
        });
        (0, jspdf_autotable_1.default)(doc, {
            head: [['Periodo registrado', '']],
            body: [
                [
                    `desde dia ${dateStart.toFormat('dd/MM/yyyy')} a las ${dateStart.toFormat('HH:mm')} horas`,
                    `hasta dia ${dateEnd.toFormat('dd/MM/yyyy')} a las ${dateEnd.toFormat('HH:mm')} horas`
                ],
            ],
            startY: doc.lastAutoTable.finalY + 1,
            theme: 'grid',
        });
        const body = [];
        let cols_events = 0;
        const base = {};
        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (!e.start.dateTime || !e.end.dateTime)
                continue;
            const base_i = luxon_1.DateTime.fromISO(e.start.dateTime).toFormat('dd/MM/yyyy');
            if (!base[base_i])
                base[base_i] = [];
            base[base_i].push(e);
            if (base[base_i].length > cols_events)
                cols_events = base[base_i].length;
        }
        const default_row = [];
        for (let i = 0; i < cols_events; i++) {
            default_row.push('');
        }
        let total_hours = 0;
        let total_days = 0;
        Object.keys(base).map((key) => {
            const events = base[key];
            if (events.length === 0)
                return;
            total_days++;
            let hours = 0;
            const row = [...default_row];
            for (let i = 0; i < events.length; i++) {
                const e = events[i];
                const timeStart = luxon_1.DateTime.fromISO(e.start.dateTime);
                const timeEnd = luxon_1.DateTime.fromISO(e.end.dateTime);
                row[i] = `${timeStart.toFormat('HH:mm')} - ${timeEnd.toFormat('HH:mm')}`;
                const interval = (timeEnd.toUnixInteger() - timeStart.toUnixInteger()) / 3600;
                hours += interval;
                total_hours += interval;
            }
            body.push([pad2z(key), ...row, hours]);
        });
        const head = ['Dia', 'Horas'];
        for (let i = 1; i <= cols_events; i++) {
            head.splice(i, 0, `Tramo ${i}`);
        }
        (0, jspdf_autotable_1.default)(doc, {
            head: [head],
            body,
            startY: doc.lastAutoTable.finalY + 1,
            theme: 'grid',
        });
        (0, jspdf_autotable_1.default)(doc, {
            head: [['Resumen', '']],
            body: [
                ['Total horas: ' + total_hours, 'Total dias: ' + total_days],
                ['Firma Trabajador\n\n', 'Empresa\n\n'],
            ],
            startY: doc.lastAutoTable.finalY + 1,
            theme: 'grid',
        });
        return doc.output();
    }
    async getWorkerByCalendar(calendar) {
        const worker = await this.workerModel.findOne({ calendar }).exec();
        return worker;
    }
    async watchEvent(worker, e) {
        var _a, _b;
        console.log(e.status);
        if (e.status === 'cancelled')
            return;
        if (((_a = e.creator) === null || _a === void 0 ? void 0 : _a.email.length) &&
            e.creator.email != worker.email &&
            e.creator.email != worker.calendar &&
            e.creator.email != worker.private_calendar) {
            console.log('desechado: personas ajenas al trabajador y calendarios del mismo.', JSON.stringify(e, null, 2));
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
    }
    async comandoVincular(worker, e) {
        console.log('comandoVincular');
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
        console.log('comandoDesvincular');
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
        console.log('comandoEntrada');
        const needCheckout = await this.CheckinService.findByWorker(worker._id);
        if (needCheckout) {
            return await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: '¿Olvidaste fichar la última salida? @checkout pendiente.',
                description: `Estas intentando fichar una nueva entrada sin haber cerrado el anterior registro de entrada. 
        Realiza antes un @checkout para poder hacer @checkin nuevamente.`,
            });
        }
        const date = new Date().toISOString();
        const entrada = await this.calendarService.createEvent(worker.calendar, {
            summary: 'Registrada',
            description: '',
            start: {
                dateTime: date,
            },
            end: {
                dateTime: date,
            },
        });
        const checkin = await this.CheckinService.create({
            worker: worker._id,
            calendar: worker.calendar,
            date,
            event: entrada.id,
        });
        if (!checkin) {
            throw new Error(`Imposible crear registro de entrada del trabajador: ${worker.name}`);
        }
        try {
            await this.calendarService.deleteEvent(worker.calendar, e.id);
        }
        catch (e) {
            console.log('Evento ya eliminado.' + checkin.event);
        }
        return checkin;
    }
    async comandoSalida(worker, e) {
        console.log('comandoSalida');
        const checkin = await this.CheckinService.findByWorker(worker._id);
        if (!checkin) {
            return await this.calendarService.patchEvent(worker.calendar, e.id, {
                summary: '¿Olvidaste fichar la última entrada?',
                description: `Si olvidaste registrar la hora de comiendo de periodo con @checkin, sigue los siguientes pasos:
        Primero, registra el @checkin y haz el @checkout normalmente.
        Segundo, si no tienes el modo libre habilitado, haz click en el registro generado y envia un email a recursos humanos con el boton de envio de canvios.`,
            });
        }
        await this.calendarService.patchEvent(worker.calendar, checkin.event, {
            summary: 'Registro de periodo completado.',
            end: {
                dateTime: new Date().toISOString(),
            },
        });
        try {
            await this.calendarService.deleteEvent(worker.calendar, e.id);
        }
        catch (e) {
            console.log('Evento ya eliminado.' + e.id);
        }
        await this.CheckinService.delete(checkin._id);
    }
    async comandoFirmar(worker, e) {
        var _a;
        console.log('comandoFirmar');
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