import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilesDocument = Files & Document;

@Schema({ versionKey: false })
export class Files {
  @Prop()
  readonly _id: string;

  @Prop()
  readonly filename: string;

  @Prop()
  readonly data: string;

  @Prop()
  readonly expireDate: string;

  @Prop({ default: new Date() })
  readonly createdAt: string;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
