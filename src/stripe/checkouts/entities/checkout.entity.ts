import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Stripe from 'stripe';
import { CheckoutStatus } from './status.enum';

export type CheckoutDocument = Checkout & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Checkout {
  @Prop()
  readonly user: string;

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
