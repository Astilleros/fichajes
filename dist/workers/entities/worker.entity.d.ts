import mongoose, { HydratedDocument, Types } from 'mongoose';
import { workerModes } from '../dto/mode.enum';
import { workerStatus } from '../dto/status.enum';
export type WorkerDocument = HydratedDocument<Worker>;
export declare class Worker {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    dni: string;
    seguridad_social: string;
    email: string;
    mobile: string;
    calendar?: string;
    private_calendar?: string;
    status?: workerStatus;
    sync: Date;
    mode: workerModes;
    locked?: boolean;
}
export declare const WorkerSchema: mongoose.Schema<Worker, mongoose.Model<Worker, any, any, any, any>, {}, {}, {}, {}, "type", Worker>;
