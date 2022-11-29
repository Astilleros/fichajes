import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  readonly username: string;

  @Prop({ select: false })
  readonly password: string;

  @Prop({ required: true })
  readonly nombre: string;

  @Prop({ required: true })
  readonly email: string;

  @Prop({ required: true })
  readonly mobile: string;

  @Prop({ required: true })
  readonly dni: string;

  @Prop({ default: '' })
  readonly calendar: string;

  @Prop({ default: new Date() })
  readonly createdAt: Date;

  @Prop({ default: new Date() })
  readonly updatedAt: Date;

  @Prop({ required: true })
  readonly empresa: string;

  @Prop({ required: true })
  readonly cif: string;

  @Prop({ required: true })
  readonly sede: string;

  @Prop({ default: null, nullable: true })
  licensedUntil: Date | null;
}
export const UserSchema = SchemaFactory.createForClass(User);
