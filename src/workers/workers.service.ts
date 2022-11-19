/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { calendar_v3 } from 'googleapis';
import { Model } from 'mongoose';
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

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    private calendarService: CalendarService,
    private FilesService: FilesService,
    private userService: UserService,
  ) {}

  async create(createWorkerDto: Worker): Promise<ListWorkerDto> {
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

  async findAll(user: JwtPayload): Promise<ListWorkerDto[]> {
    const workers: WorkerDocument[] = await this.workerModel
      .find({ user: user._id })
      .exec();
    return workers;
  }
  async filterEvents(
    user: JwtPayload,
    worker_id: string,
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

  findOne(user_id: string, _id: string) {
    const worker = this.workerModel.findOne({ _id, user: user_id }).exec();
    return worker;
  }

  update(user_id: string, _id: string, updateWorkerDto: UpdateWorkerDto) {
    return this.workerModel
      .findOneAndUpdate({ _id, user: user_id }, updateWorkerDto, { new: true })
      .exec();
  }

  async remove(user_id: string, _id: string) {
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
    return worker;
  }

  async shareCalendar(user_id: string, worker_id: string) {
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

  async unshareCalendar(user_id: string, worker_id: string) {
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

  async generatePdfToSign(
    userJwt: JwtPayload,
    worker_id: string,
    start: string,
    end: string,
  ) {
    console.log(start, end);

    const user = await this.userService.findOne(userJwt._id);
    const worker = await this.findOne(userJwt._id, worker_id);
    const events = await this.filterEvents(
      userJwt,
      worker_id,
      new Date(start).toISOString(),
      new Date(end).toISOString(),
    );
    console.log(events.length);

    const doc: any = new jsPDF({});
    autoTable(doc, {
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

    const body: any = [];
    const days = Math.round(
      (new Date(end).getTime() / 1000 - new Date(start).getTime() / 1000) /
        (24 * 60 * 60),
    );
    console.log(days);

    const base: any = {};
    let cols_events = 0;
    let total_hours = 0;
    let total_days = 0;
    for (let i = new Date(start).getDate(); i <= days; i++) {
      base[i] = [];
    }

    console.log(JSON.stringify(base, null, 2));

    for (let i = 0; i < events.length; i++) {
      const e = events[i];

      if (!e.start.dateTime || !e.end.dateTime) continue;
      const start = new Date(e.start.dateTime);
      if (!base[start.getDate()]) base[start.getDate()] = [];
      base[start.getDate()].push(e);
      if (base[start.getDate()].length > cols_events)
        cols_events = base[start.getDate()].length;
    }
    console.log(cols_events);

    Object.keys(base).map((key) => {
      const events = base[key];
      if (events.length === 0) return;
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
        const s_h = e.start.dateTime.slice(11, 13)
        const e_h = e.end.dateTime.slice(11, 13)
        const s_m = e.start.dateTime.slice(14, 16)
        const e_m = e.end.dateTime.slice(14, 16)
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
    autoTable(doc, {
      head: [['Día', ...row, 'Horas']],
      body,
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
    });
    autoTable(doc, {
      head: [],
      body: [
        ['Total horas: ' + total_hours, 'Total dias: ' + total_days],
        ['Firma Trabajador', 'Empresa'],
      ],
      startY: doc.lastAutoTable.finalY,
    });
    return doc.output();
  }

  //// CALENDAR
  async getWorkerByCalendar(calendar: string) {
    const worker = await this.workerModel.findOne({ calendar }).exec();
    return worker;
  }

  async watchEvent(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    if (!e.start?.date) return; // NO ES UN COMANDO
    if (e.summary === '@vincular') return this.comandoVincular(worker, e);
    if (e.summary === '@desvincular') return this.comandoDesvincular(worker, e);
    if (e.summary === '@mes') return this.comandoMes(worker, e);
  }

  async comandoVincular(worker: WorkerDocument, e: calendar_v3.Schema$Event) {
    if (worker.status === workerStatus.pending) {
      await this.update(worker.user, worker._id, {
        status: workerStatus.linked,
      });
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

    const url = await this.FilesService.create(
      `ficfac_${start.toISOString()}`,
      pdf_data,
    );

    await this.calendarService.patchEvent(worker.calendar, e.id, {
      summary: 'Hoja generada',
      description: `Enlace de descarga de un uso: ${url}`,
    });
  }
}

// HELPS.... DELETE
const pad2z = (data: any) => {
  return String(data).padStart(2, '0');
};
