import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SignDocument = Sign & Document;

@Schema({ versionKey: false })
export class Sign {
  @Prop()
  readonly user: string;

  @Prop()
  readonly worker: string;

  @Prop()
  readonly file: string;

  @Prop()
  readonly month: string;

  @Prop()
  readonly createdAt: string;
}

export const SignSchema = SchemaFactory.createForClass(Sign);
