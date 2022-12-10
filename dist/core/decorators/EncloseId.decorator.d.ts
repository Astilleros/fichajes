import { PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
export declare class EncloseId implements PipeTransform<any, Types.ObjectId> {
    transform(value: any): Types.ObjectId;
}
