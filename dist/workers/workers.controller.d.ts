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
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { Types } from 'mongoose';
import { Worker } from './entities/worker.entity';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    create(user: JwtPayload, createWorkerDto: CreateWorkerDto): Promise<Worker>;
    findAll(user: JwtPayload): Promise<Worker[]>;
    filterEvents(user: JwtPayload, worker_id: Types.ObjectId, start: string, end: string): Promise<import("googleapis").calendar_v3.Schema$Event[]>;
    findOne(user: JwtPayload, _id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & Required<{
        _id: Types.ObjectId;
    }>>;
    update(user: JwtPayload, _id: Types.ObjectId, updateWorkerDto: UpdateWorkerDto): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(user: JwtPayload, _id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & Required<{
        _id: Types.ObjectId;
    }>>;
    shareCalendar(user: JwtPayload, worker_id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & Required<{
        _id: Types.ObjectId;
    }>>;
    unshareCalendar(user: JwtPayload, worker_id: Types.ObjectId): Promise<import("mongoose").Document<unknown, any, Worker> & Worker & Required<{
        _id: Types.ObjectId;
    }>>;
    generatePdf(user: JwtPayload, worker_id: Types.ObjectId, start: string, end: string): Promise<any>;
}
