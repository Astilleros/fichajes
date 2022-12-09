import { Types } from 'mongoose';
export declare class CreateCheckoutDto {
    user: Types.ObjectId;
    checkout: any;
    createdAt?: Date;
    confirmedAt?: Date;
    cacelledAt?: Date;
}
