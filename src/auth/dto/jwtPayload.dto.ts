import { Types } from 'mongoose';

export class JwtPayload {
  _id: Types.ObjectId;
  username: string;
  email: string;
}
