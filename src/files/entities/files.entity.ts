import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FilesDocument = HydratedDocument<Files>;

@Schema({ versionKey: false })
export class Files {
  @Prop()
  readonly filename: string;

  @Prop()
  readonly data: string;

  @Prop()
  readonly calendar: string;

  @Prop()
  readonly event: string;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
