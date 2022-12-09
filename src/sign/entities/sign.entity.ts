import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type SignDocument = HydratedDocument<Sign>;

@Schema({ versionKey: false })
export class Sign {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  readonly user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true })
  readonly worker: Types.ObjectId;

  @Prop()
  readonly file: string;

  @Prop()
  readonly month: string;

  @Prop()
  readonly createdAt: Date;
}

export const SignSchema = SchemaFactory.createForClass(Sign);
