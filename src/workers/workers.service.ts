import { Injectable, StreamableFile } from '@nestjs/common';
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

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    private calendarService: CalendarService,
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
    let w: WorkerDocument = await this.workerModel
      .findOne({ _id: worker_id, user: user._id })
      .exec();
    if (!w) throw new Error('Trabajador no encontrado');
    const events = await this.calendarService.filterEvents(
      w.calendar,
      start,
      end,
      400,
    );

    if (w.status === workerStatus.pending && events.length) {
      w = await this.workerModel.findOneAndUpdate(
        { _id: w._id },
        { status: workerStatus.linked },
        { new: true },
      );
    }

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
        row[i] = `${pad2z(start_au.getHours())}:${pad2z(
          start_au.getMinutes(),
        )} - ${pad2z(end_au.getHours())}:${pad2z(end_au.getMinutes())}`;
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
}

const pad2z = (data: any) => {
  return String(data).padStart(2, '0');
};
