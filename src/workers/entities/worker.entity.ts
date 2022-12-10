import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ExposeId } from 'src/core/decorators/ExposeId.decorator';
import { workerModes } from '../dto/mode.enum';
import { workerStatus } from '../dto/status.enum';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema({ versionKey: false })
export class Worker {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  @ExposeId()
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @ExposeId()
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  dni: string;

  @Prop()
  seguridad_social: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop()
  mobile: string;

  @Prop({ default: '' })
  calendar?: string;

  @Prop({ default: '' })
  private_calendar?: string;

  @Prop({ default: workerStatus.unlinked })
  status?: workerStatus;

  @Prop({ default: new Date() })
  sync: Date;

  @Prop({ enum: workerModes, default: workerModes.none })
  mode: workerModes;

  @Prop({ default: false })
  locked?: boolean;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
