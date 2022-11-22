import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSignDto } from './dto/create-sign.dto';
import { Sign, SignDocument } from './entities/sign.entity';

@Injectable()
export class SignService {
  constructor(@InjectModel(Sign.name) private SignModel: Model<SignDocument>) {}

  async create(data: CreateSignDto): Promise<Sign> {
    const file = new this.SignModel(data);
    return await file.save();
  }

  async findById(_id: string) {
    return await this.SignModel.findOne({ _id }).exec();
  }
}
