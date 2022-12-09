import { Types } from 'mongoose';

export class CreateCheckinDto {
  readonly worker: Types.ObjectId;
  readonly calendar: string;
  readonly event: string;
  readonly date: string;
}
