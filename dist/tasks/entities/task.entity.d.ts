import mongoose, { Types } from 'mongoose';
export type TaskDocument = Task & Document;
export declare class Task {
    name: string;
    user: Types.ObjectId;
    description: string;
    calendar: string;
    workers: Types.ObjectId[];
}
export declare const TaskSchema: mongoose.Schema<Task, mongoose.Model<Task, any, any, any, any>, {}, {}, {}, {}, "type", Task>;
