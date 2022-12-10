import mongoose, { HydratedDocument, Types } from 'mongoose';
export type SignDocument = HydratedDocument<Sign>;
export declare class Sign {
    readonly _id: Types.ObjectId;
    readonly user: Types.ObjectId;
    readonly worker: Types.ObjectId;
    readonly file: string;
    readonly month: string;
    readonly createdAt: Date;
}
export declare const SignSchema: mongoose.Schema<Sign, mongoose.Model<Sign, any, any, any, any>, {}, {}, {}, {}, "type", Sign>;
