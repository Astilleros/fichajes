import mongoose, { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    _id: Types.ObjectId;
    readonly username: string;
    readonly password: string;
    readonly nombre: string;
    readonly email: string;
    readonly mobile: string;
    readonly dni: string;
    readonly calendar: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly empresa: string;
    readonly cif: string;
    readonly sede: string;
    licensedUntil?: Date;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any>, {}, {}, {}, {}, "type", User>;
