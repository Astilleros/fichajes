import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskDocument = Task & Document;

@Schema({ versionKey: false })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  user: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  calendar: string;

  @Prop({ default: [] })
  workers: [string];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
