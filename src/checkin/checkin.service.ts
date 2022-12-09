import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { Checkin, CheckinDocument } from './entities/checkin.entity';

@Injectable()
export class CheckinService {
  constructor(
    @InjectModel(Checkin.name) private CheckinModel: Model<CheckinDocument>,
  ) {}

  async create(checkinDate: CreateCheckinDto): Promise<CheckinDocument> {
    const checkin = new this.CheckinModel(checkinDate);
    await checkin.save();
    return checkin;
  }

  async findByWorker(worker: Types.ObjectId): Promise<CheckinDocument> {
    const checkin = await this.CheckinModel.findOne({ worker }).exec();
    return checkin;
  }

  async delete(_id: Types.ObjectId): Promise<void> {
    await this.CheckinModel.deleteOne({ _id }).exec();
  }
}
