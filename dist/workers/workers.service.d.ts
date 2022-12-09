/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { calendar_v3 } from 'googleapis';
import { Model, Types } from 'mongoose';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { CalendarService } from 'src/calendar/calendar.service';
import { ListWorkerDto } from './dto/list-worker.dto';
import { workerStatus } from './dto/status.enum';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker, WorkerDocument } from './entities/worker.entity';
import { UserService } from 'src/user/user.service';
import { FilesService } from 'src/files/files.service';
import { CheckinService } from 'src/checkin/checkin.service';
import { SignService } from 'src/sign/sign.service';
import { workerModes } from './dto/mode.enum';
import { CreateWorkerDto } from './dto/create-worker.dto';
export declare class WorkersService {
    private workerModel;
    private calendarService;
    private FilesService;
    private userService;
    private CheckinService;
    private SignService;
    constructor(workerModel: Model<WorkerDocument>, calendarService: CalendarService, FilesService: FilesService, userService: UserService, CheckinService: CheckinService, SignService: SignService);
    create(user: JwtPayload, createWorkerDto: CreateWorkerDto): Promise<ListWorkerDto>;
    findAll(user: JwtPayload): Promise<ListWorkerDto[]>;
    filterEvents(user: JwtPayload, worker_id: Types.ObjectId, start: string, end: string): Promise<calendar_v3.Schema$Event[]>;
    findOne(user_id: Types.ObjectId, _id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    update(user_id: Types.ObjectId, _id: Types.ObjectId, updateWorkerDto: UpdateWorkerDto): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    _setInternal(_id: Types.ObjectId, internal: {
        locked?: boolean;
        status?: workerStatus;
        sync?: string;
    }): Promise<Worker>;
    remove(user_id: Types.ObjectId, _id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    shareCalendar(user_id: Types.ObjectId, worker_id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    unshareCalendar(user_id: Types.ObjectId, worker_id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    changeMode(user_id: Types.ObjectId, worker_id: Types.ObjectId, new_mode: workerModes): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    generatePdfToSign(jwt: JwtPayload, worker_id: Types.ObjectId, start: string, end: string): Promise<any>;
    getWorkerByCalendar(calendar: string): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    watchEvent(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void | calendar_v3.Schema$Event | (import("mongoose").Document<unknown, any, import("../checkin/entities/checkin.entity").Checkin> & import("../checkin/entities/checkin.entity").Checkin & {
        _id: Types.ObjectId;
    })>;
    comandoVincular(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
    comandoDesvincular(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
    comandoMes(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
    comandoEntrada(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event | (import("mongoose").Document<unknown, any, import("../checkin/entities/checkin.entity").Checkin> & import("../checkin/entities/checkin.entity").Checkin & {
        _id: Types.ObjectId;
    })>;
    comandoSalida(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    comandoFirmar(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
}
