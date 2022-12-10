import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ExposeId } from 'src/core/decorators/ExposeId.decorator';
import Stripe from 'stripe';
import { CheckoutStatus } from './status.enum';

export type CheckoutDocument = HydratedDocument<Checkout>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Checkout {
  //@Prop({ type: mongoose.Schema.Types.ObjectId })
  @ExposeId()
  readonly _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @ExposeId()
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
