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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { Types } from 'mongoose';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(user: JwtPayload, createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity").TaskDocument>;
    findAll(user: JwtPayload): Promise<import("./entities/task.entity").TaskDocument[]>;
    findOne(user: JwtPayload, _id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, import("./entities/task.entity").TaskDocument> & import("./entities/task.entity").Task & Document & {
        _id: Types.ObjectId;
    }>;
    update(user: JwtPayload, _id: Types.ObjectId, updateTaskDto: UpdateTaskDto): Promise<import("mongoose").Document<unknown, any, import("./entities/task.entity").TaskDocument> & import("./entities/task.entity").Task & Document & {
        _id: Types.ObjectId;
    }>;
    remove(user: JwtPayload, _id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, import("./entities/task.entity").TaskDocument> & import("./entities/task.entity").Task & Document & {
        _id: Types.ObjectId;
    }>;
    addWorker(user: JwtPayload, _id: Types.ObjectId, worker_id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, import("./entities/task.entity").TaskDocument> & import("./entities/task.entity").Task & Document & {
        _id: Types.ObjectId;
    }>;
    deleteWorker(user: JwtPayload, _id: Types.ObjectId, worker_id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, import("./entities/task.entity").TaskDocument> & import("./entities/task.entity").Task & Document & {
        _id: Types.ObjectId;
    }>;
}
