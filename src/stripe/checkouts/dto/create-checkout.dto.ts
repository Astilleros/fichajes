import { Types } from 'mongoose';

export class CreateCheckoutDto {
  user: Types.ObjectId;

  checkout: any;

  createdAt?: Date;

  confirmedAt?: Date;

  cacelledAt?: Date;
}
