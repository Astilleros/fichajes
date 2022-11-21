import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    create(user: JwtPayload, createWorkerDto: CreateWorkerDto): Promise<import("./dto/list-worker.dto").ListWorkerDto>;
    findAll(user: JwtPayload): Promise<import("./dto/list-worker.dto").ListWorkerDto[]>;
    filterEvents(user: JwtPayload, worker_id: string, start: string, end: string): Promise<import("googleapis").calendar_v3.Schema$Event[]>;
    findOne(user: JwtPayload, id: string): Promise<import("./entities/worker.entity").Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(user: JwtPayload, id: string, updateWorkerDto: UpdateWorkerDto): Promise<import("./entities/worker.entity").Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(user: JwtPayload, id: string): Promise<import("./entities/worker.entity").Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    shareCalendar(user: JwtPayload, id: string): Promise<import("./entities/worker.entity").Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    unshareCalendar(user: JwtPayload, id: string): Promise<import("./entities/worker.entity").Worker & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    generatePdf(user: JwtPayload, worker_id: string, start: string, end: string): Promise<any>;
}
