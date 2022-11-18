import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { workerStatus } from '../dto/status.enum';

export type WorkerDocument = Worker & Document;

@Schema({ versionKey: false })
export class Worker {
  @Prop()
  readonly user: string;

  @Prop({
    required: true,
  })
  readonly name: string;

  @Prop()
  readonly dni: string;

  @Prop()
  readonly seguridad_social: string;

  @Prop({
    required: true,
  })
  readonly email: string;

  @Prop()
  readonly mobile: string;

  @Prop({ default: '' })
  calendar?: string;

  @Prop({ default: workerStatus.unlinked })
  status?: workerStatus;

  @Prop({ default: new Date().toISOString() })
  sync?: string;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
