import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import Stripe from 'stripe';
import { CheckoutStatus } from './status.enum';

export type CheckoutDocument = HydratedDocument<Checkout>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Checkout {
  @Prop()
  readonly user: Types.ObjectId;

  @Prop({ default: new Date() })
  readonly createdAt: Date;

  @Prop({ type: Object })
  checkout: Stripe.Checkout.Session;

  @Prop({ enum: CheckoutStatus, default: CheckoutStatus.pristine })
  status: CheckoutStatus;

  @Prop()
  confirmedAt: Date;

  @Prop()
  cacelledAt: Date;
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);
