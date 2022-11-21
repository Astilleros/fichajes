import { calendar_v3 } from 'googleapis';
import { Model } from 'mongoose';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { CalendarService } from 'src/calendar/calendar.service';
import { ListWorkerDto } from './dto/list-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker, WorkerDocument } from './entities/worker.entity';
import { UserService } from 'src/user/user.service';
import { FilesService } from 'src/files/files.service';
import { CheckinService } from 'src/checkin/checkin.service';
export declare class WorkersService {
    private workerModel;
    private calendarService;
    private FilesService;
    private userService;
    private CheckinService;
    constructor(workerModel: Model<WorkerDocument>, calendarService: CalendarService, FilesService: FilesService, userService: UserService, CheckinService: CheckinService);
    create(createWorkerDto: Worker): Promise<ListWorkerDto>;
    findAll(user: JwtPayload): Promise<ListWorkerDto[]>;
    filterEvents(user: JwtPayload, worker_id: string, start: string, end: string): Promise<calendar_v3.Schema$Event[]>;
    findOne(user_id: string, _id: string): Promise<Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(user_id: string, _id: string, updateWorkerDto: UpdateWorkerDto): Promise<Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(user_id: string, _id: string): Promise<Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    shareCalendar(user_id: string, worker_id: string): Promise<Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    unshareCalendar(user_id: string, worker_id: string): Promise<Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    generatePdfToSign(userJwt: JwtPayload, worker_id: string, start: string, end: string): Promise<any>;
    getWorkerByCalendar(calendar: string): Promise<Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    watchEvent(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void | import("../checkin/entities/checkin.entity").CheckinDocument>;
    comandoVincular(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
    comandoDesvincular(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
    comandoMes(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
    comandoCheckin(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<import("../checkin/entities/checkin.entity").CheckinDocument>;
    comandoCheckout(worker: WorkerDocument, e: calendar_v3.Schema$Event): Promise<void>;
}
