import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ versionKey: false })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  calendar: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    default: [],
  })
  workers: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
