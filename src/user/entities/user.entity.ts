import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { ExposeId } from 'src/core/decorators/ExposeId.decorator';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  //@Prop({ type: mongoose.Schema.Types.ObjectId })
  @ExposeId()
  _id: Types.ObjectId;

  @Exclude()
  @Prop({ required: true })
  readonly username: string;

  @Exclude()
  @Prop()
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

  @Prop()
  licensedUntil?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
