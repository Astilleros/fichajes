import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ExposeId } from 'src/core/decorators/ExposeId.decorator';

export type SignDocument = HydratedDocument<Sign>;

@Schema({ versionKey: false })
export class Sign {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  @ExposeId()
  readonly _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @ExposeId()
  readonly user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true })
  @ExposeId()
  readonly worker: Types.ObjectId;

  @Prop()
  readonly file: string;

  @Prop()
  readonly month: string;

  @Prop()
  readonly createdAt: Date;
}

export const SignSchema = SchemaFactory.createForClass(Sign);
