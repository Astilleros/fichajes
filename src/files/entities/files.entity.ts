import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilesDocument = Files & Document;

@Schema({ versionKey: false })
export class Files {
  @Prop()
  readonly filename: string;

  @Prop()
  readonly data: string;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
