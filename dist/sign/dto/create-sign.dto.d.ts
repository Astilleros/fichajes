import { Types } from 'mongoose';
export declare class CreateSignDto {
    readonly user: Types.ObjectId;
    readonly worker: Types.ObjectId;
    readonly file: string;
    readonly month: string;
    readonly createdAt: string;
}
