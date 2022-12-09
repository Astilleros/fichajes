import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CheckinDocument = HydratedDocument<Checkin>;

@Schema({ versionKey: false })
export class Checkin {
  @Prop({ required: true })
  readonly worker: string;

  @Prop({ required: true })
  readonly calendar: string;

  @Prop({ required: true })
  readonly event: string;

  @Prop({ default: new Date().toISOString() })
  readonly date: string;
}

export const CheckinSchema = SchemaFactory.createForClass(Checkin);
