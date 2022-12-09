/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { calendar_v3 } from 'googleapis';
import { Model, Types } from 'mongoose';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { CalendarService } from 'src/calendar/calendar.service';
import { ListWorkerDto } from './dto/list-worker.dto';
import { workerStatus } from './dto/status.enum';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker, WorkerDocument } from './entities/worker.entity';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserService } from 'src/user/user.service';
import { FilesService } from 'src/files/files.service';
import { CheckinService } from 'src/checkin/checkin.service';
import { SignService } from 'src/sign/sign.service';
import { workerModes } from './dto/mode.enum';
import { DateTime, Settings } from 'luxon';
import { CreateWorkerDto } from './dto/create-worker.dto';
Settings.defaultZone = "Europe/Madrid";

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    private calendarService: CalendarService,
    private FilesService: FilesService,
    private userService: UserService,
    private CheckinService: CheckinService,
    private SignService: SignService,
  ) { }

  async create(user: JwtPayload,  createWorkerDto: CreateWorkerDto): Promise<ListWorkerDto> {
    const createdWorker = new this.workerModel({user: user._id, mode: workerModes.none, ...createWorkerDto});

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

  async findAll(user: JwtPayload): Promise<ListWorkerDto[]> {
    const workers: WorkerDocument[] = await this.workerModel
      .find({ user: user._id })
      .exec();
    return workers;
  }
  async filterEvents(
    user: JwtPayload,
    worker_id: Types.ObjectId,
    start: string,
    end: string,
  ): Promise<calendar_v3.Schema$Event[]> {
    const w: WorkerDocument = await this.workerModel
      .findOne({ _id: worker_id, user: user._id })
      .exec();
    if (!w) throw new Error('Trabajador no encontrado');
    const events = await this.calendarService.filterEvents(
      w.calendar,
      start,
      end,
      400,
    );

    return events;
  }

  findOne(user_id: Types.ObjectId, _id: Types.ObjectId) {
    const worker = this.workerModel.findOne({ _id, user: user_id }).exec();
    return worker;
  }

  async update(user_id: Types.ObjectId, _id: Types.ObjectId, updateWorkerDto: UpdateWorkerDto) {
    const worker = await this.workerModel.findById(_id);
    let mode = worker.mode

    if (updateWorkerDto.mode !== worker.mode) {
      const editMode = await this.changeMode(
        user_id,
        worker._id,
        updateWorkerDto.mode,
      );
      mode = editMode.mode;
    }

    return this.workerModel
      .findOneAndUpdate({ _id, user: user_id }, {...updateWorkerDto, mode}, { new: true })
      .exec();
  }

  async _setInternal(_id: Types.ObjectId, internal : { locked?: boolean, status?: workerStatus, sync?: string }): Promise<Worker>{
    const worker = await this.workerModel.findByIdAndUpdate(_id, internal, {new: true});
    return worker;
  }

  async remove(user_id: Types.ObjectId, _id: Types.ObjectId) {
    const worker = await this.workerModel
      .findOneAndDelete({ _id, user: user_id })
      .exec();
    if (!worker) throw new Error('Trabajador no encontrado.');
    if (
      worker.status === workerStatus.linked ||
      worker.status === workerStatus.pending
    )
      await this.calendarService.unshareCalendar(worker.calendar, worker.email);

    await this.calendarService.deleteCalendar(worker.calendar);
    await this.calendarService.deleteCalendar(worker.private_calendar);
    return worker;
  }

  async shareCalendar(user_id: Types.ObjectId, worker_id: Types.ObjectId) {
    const worker = await this.workerModel.findOne({
      _id: worker_id,
      user: user_id,
    });
    if (worker.status !== workerStatus.unlinked) return worker;
    if (!worker?.calendar)
      throw new Error('Error inesperado en el calendario.');
    if (!worker?.email) throw new Error('Trabajador no tiene email asignado.');

    await this.calendarService.shareCalendar(worker.calendar, worker.email);

    const now = new Date().toISOString();
    await this.calendarService.createEvent(worker.calendar, {
      summary:
        'Fichar Facil: Crea tu primer registro para finalizar la verificación.',
      description: `
Si puedes ver este evento ¡Ya estas en el último paso!
Elimina este mensaje y empieza a registrar tu jornada añadiendo eventos en este calendario.
En la web "www.ficharfacil.com" encontraras una sección con manuales, videos y preguntas frecuentes.
      `,
      start: { dateTime: now },
      end: { dateTime: now },
    });
    const updated = await this.workerModel.findOneAndUpdate(
      { _id: worker._id },
      { status: 1 },
      { new: true },
    );

    return updated;
  }

  async unshareCalendar(user_id: Types.ObjectId, worker_id: Types.ObjectId) {
    const worker = await this.workerModel.findOne({
      _id: worker_id,
      user: user_id,
    });
    if (!worker?.calendar)
      throw new Error('Trabajador no tiene email vinculado');

    await this.calendarService.unshareCalendar(worker.calendar, worker.email);

    const updated = await this.workerModel.findOneAndUpdate(
      { _id: worker._id },
      { status: 0 },
      { new: true },
    );

    return updated;
  }

  async changeMode(user_id: Types.ObjectId, worker_id: Types.ObjectId, new_mode: workerModes) {
    const w = await this.workerModel.findOne({
      _id: worker_id,
      user: user_id,
    });

    if (w.mode === new_mode) return w;
    if (new_mode === workerModes.none)
      await this.calendarService.unshareCalendar(w.calendar, w.email);
    if (new_mode === workerModes.place) {
      if (w.mode !== workerModes.none)
        await this.calendarService.unshareCalendar(w.calendar, w.email);
      await this.calendarService.shareCalendar(w.calendar, w.email, 'reader');
    }
    if (new_mode === workerModes.open) {
      if (w.mode === workerModes.place)
        await this.calendarService.unshareCalendar(w.calendar, w.email);
      await this.calendarService.shareCalendar(w.calendar, w.email, 'writer');
    }

    w.mode = new_mode;
    return await w.save();
  }

  async generatePdfToSign(
    jwt: JwtPayload,
    worker_id: Types.ObjectId,
    start: string,
    end: string,
  ) {

    const dateStart = DateTime.fromISO(start);
    const dateEnd = DateTime.fromISO(end);
    const user = await this.userService.findOne(jwt._id);
    const worker = await this.findOne(jwt._id, worker_id);
    const events = await this.filterEvents(
      jwt,
      worker_id,
      dateStart.toISO(),
      dateEnd.toISO(),
    );

    const doc: any = new jsPDF({});
    autoTable(doc, {
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
    autoTable(doc, {
      head: [['Empresa', '', '']],
      body: [
        ['Nombre: ' + user.empresa, 'CIF: ' + user.cif, 'Sede: ' + user.sede]
      ],
      startY: doc.lastAutoTable.finalY + 1,
      theme: 'grid',
    });
    autoTable(doc, {
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

    const body: any = [];

    let cols_events = 0;
    const base: any = {};
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (!e.start.dateTime || !e.end.dateTime) continue;
      const base_i = DateTime.fromISO(e.start.dateTime).toFormat('dd/MM/yyyy')
      if (!base[base_i]) base[base_i] = [];
      base[base_i].push(e);
      if (base[base_i].length > cols_events) cols_events = base[base_i].length;
    }

    const default_row = []
    for (let i = 0; i < cols_events; i++) {
      default_row.push('')
    }

    let total_hours = 0;
    let total_days = 0;
    Object.keys(base).map((key) => {
      const events = base[key];
      if (events.length === 0) return;
      total_days++;
      let hours = 0;
      const row = [...default_row];

      //
      for (let i = 0; i < events.length; i++) {
        const e = events[i];
        const timeStart = DateTime.fromISO(e.start.dateTime)
        const timeEnd = DateTime.fromISO(e.end.dateTime)
        row[i] = `${timeStart.toFormat('HH:mm')} - ${timeEnd.toFormat('HH:mm')}`
        const interval = (timeEnd.toUnixInteger() - timeStart.toUnixInteger()) / 3600;
        hours += interval
        total_hours += interval
      }
      body.push([pad2z(key), ...row, hours.toFixed(2)]);
    });

    const head = ['Dia', 'Horas'];
    for (let i = 1; i <= cols_events; i++) {
      head.splice(i, 0, `Tramo ${i}`)
    }
    autoTable(doc, {
      head: [head],
      body,
      startY: doc.lastAutoTable.finalY + 1,
      theme: 'grid',
    });
    autoTable(doc, {
      head: [['Resumen', '']],
      body: [
        ['Total horas: ' + total_hours.toFixed(2), 'Total dias: ' + total_days],
        ['Firma Trabajador\n\n', 'Empresa\n\n'],
      ],
      startY: doc.lastAutoTable.finalY + 1,
      theme: 'grid',
    });
    return doc.output();
  }

  //// CALENDAR
  async getWorkerByCalendar(calendar: string) {
    const worker = await this.workerModel.findOne({ calendar }).exec();
    return worker;
  }

  async watchEvent(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    // Desechamos eventos eliminados
    console.log(e.status );
    if (e.status === 'cancelled') return;

    // Desechamos eventos creados por personas ajenas al trabajador y calendarios del mismo.
    if (
      !e.organizer.self &&
      e.creator?.email.length &&
      e.creator.email != worker.email &&
      e.creator.email != worker.calendar &&
      e.creator.email != worker.private_calendar
    ) {
      console.log('desechado: personas ajenas al trabajador y calendarios del mismo.', JSON.stringify(e, null, 2));
      return await this.calendarService.deleteEvent(worker.calendar, e.id);
    }

    if (e.start?.date) {
      if (e.summary === '@vincular') return this.comandoVincular(worker, e);
      if (e.summary === '@desvincular')
        return this.comandoDesvincular(worker, e);
      if (e.summary === '@mes') return this.comandoMes(worker, e);
      if (e.summary === '@entrada') return this.comandoEntrada(worker, e);
      if (e.summary === '@salida') return this.comandoSalida(worker, e);
      if (e.summary === '@firmar') return this.comandoFirmar(worker, e);
    }
  }

  async comandoVincular(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    console.log('comandoVincular');
    
    if (worker.status === workerStatus.pending) {

      await this._setInternal(worker._id, {status: workerStatus.linked})

      await this.calendarService.patchEvent(worker.calendar, e.id, {
        summary: 'Vinculado corectamente',
      });
    }
    if (worker.status === workerStatus.linked) {
      await this.calendarService.patchEvent(worker.calendar, e.id, {
        summary: 'Calendario ya vinculado.',
      });
    }
  }

  async comandoDesvincular(
    worker: WorkerDocument,
    e: calendar_v3.Schema$Event,
  ) {
    console.log('comandoDesvincular');
    await this.unshareCalendar(worker.user, worker._id);

    await this.calendarService.patchEvent(worker.calendar, e.id, {
      summary: 'Calendario desvinculado',
    });
  }

  async comandoMes(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    const reference = new Date(e.start.date);
    const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
    const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);

    const pdf_data = await this.generatePdfToSign(
      {
        _id: worker.user,
        username: '',
        email: '',
      },
      worker._id,
      start.toISOString(),
      end.toISOString(),
    );

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

  async comandoEntrada(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    console.log('comandoEntrada');
    // Comprobar no hayan entrado ya.
    const needCheckout = await this.CheckinService.findByWorker(worker._id);
    if (needCheckout) {
      return await this.calendarService.patchEvent(worker.calendar, e.id, {
        summary: '¿Olvidaste fichar la última salida? @checkout pendiente.',
        description: `Estas intentando fichar una nueva entrada sin haber cerrado el anterior registro de entrada. 
        Realiza antes un @checkout para poder hacer @checkin nuevamente.`,
      });
    }
    const date = new Date().toISOString();
    // Crea evento
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

    // Crear nueva entrada
    const checkin = await this.CheckinService.create({
      worker: worker._id,
      calendar: worker.calendar,
      date,
      event: entrada.id,
    });
    if (!checkin) {
      throw new Error(
        `Imposible crear registro de entrada del trabajador: ${worker.name}`,
      );
    }


    try {
      await this.calendarService.deleteEvent(worker.calendar, e.id);
    } catch (e) {
      console.log('Evento ya eliminado.' + checkin.event);
    }


    return checkin;
  }

  async comandoSalida(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    console.log('comandoSalida');
    // Comprobar que hayan checkin.
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
    } catch (e) {
      console.log('Evento ya eliminado.' + e.id);
    }

    await this.CheckinService.delete(checkin._id);
  }

  async comandoFirmar(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    console.log('comandoFirmar');
    if (!e.attachments?.length) {
      return await this.calendarService.patchEvent(worker.calendar, e.id, {
        summary: 'Olvidaste adjuntar el documento.',
        description: `Intentalo nuevamente comprobando que en la creación de levento se adjunta el archivo correspondiente. Puedes eliminar esta alerta.`,
      });
    }

    const reference = new Date(e.start.date);
    const month = new Date(
      reference.getFullYear(),
      reference.getMonth(),
      1,
    ).toISOString();

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
}

// HELPS.... DELETE
const pad2z = (data: any) => {
  return String(data).padStart(2, '0');
};
