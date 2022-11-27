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
import { Model } from 'mongoose';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { Checkout, CheckoutDocument } from './entities/checkout.entity';
export declare class CheckoutsService {
    private readonly CheckoutModel;
    constructor(CheckoutModel: Model<CheckoutDocument>);
    create(createCheckoutDto: CreateCheckoutDto): Promise<import("mongoose").Document<unknown, any, CheckoutDocument> & Checkout & Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOne(session_id: string): Promise<import("mongoose").Document<unknown, any, CheckoutDocument> & Checkout & Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(user_id: string): Promise<(import("mongoose").Document<unknown, any, CheckoutDocument> & Checkout & Document & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    update(_id: string, updateCheckoutDto: UpdateCheckoutDto): Promise<import("mongoose").Document<unknown, any, CheckoutDocument> & Checkout & Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(_id: string): Promise<import("mongodb").DeleteResult>;
}
