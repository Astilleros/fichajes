import { Types } from 'mongoose';
export declare class CreateCheckinDto {
    readonly worker: Types.ObjectId;
    readonly calendar: string;
    readonly event: string;
    readonly date: string;
}
