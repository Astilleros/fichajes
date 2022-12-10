import mongoose, { HydratedDocument, Types } from 'mongoose';
import Stripe from 'stripe';
import { CheckoutStatus } from './status.enum';
export type CheckoutDocument = HydratedDocument<Checkout>;
export declare class Checkout {
    readonly _id: Types.ObjectId;
    readonly user: Types.ObjectId;
    readonly createdAt: Date;
    checkout: Stripe.Checkout.Session;
    status: CheckoutStatus;
    confirmedAt: Date;
    cacelledAt: Date;
}
export declare const CheckoutSchema: mongoose.Schema<Checkout, mongoose.Model<Checkout, any, any, any, any>, {}, {}, {}, {}, "type", Checkout>;
