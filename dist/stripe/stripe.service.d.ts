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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import Stripe from 'stripe';
import { CheckoutsService } from './checkouts/checkouts.service';
export declare class StripeService {
    private cfg;
    private CheckoutsService;
    private stripe;
    private webhook_secret;
    constructor(cfg: ConfigService, CheckoutsService: CheckoutsService);
    createCheckout(user: JwtPayload): Promise<import("mongoose").Document<unknown, any, import("./checkouts/entities/checkout.entity").CheckoutDocument> & import("./checkouts/entities/checkout.entity").Checkout & Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    listCheckouts(user: JwtPayload): Promise<(import("mongoose").Document<unknown, any, import("./checkouts/entities/checkout.entity").CheckoutDocument> & import("./checkouts/entities/checkout.entity").Checkout & Document & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    webhook(sig: string, body: any): Promise<void>;
    createOrder(session: Stripe.Checkout.Session): Promise<void>;
    fulfillOrder(session: Stripe.Checkout.Session): Promise<void>;
    emailCustomerAboutFailedPayment(session: Stripe.Checkout.Session): Promise<void>;
}
