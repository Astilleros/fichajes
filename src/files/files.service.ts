import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { Files, FilesDocument } from './entities/files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files.name) private FilesModel: Model<FilesDocument>,
  ) {}

  async create(data: CreateFileDto): Promise<string> {
    const file = new this.FilesModel(data);
    await file.save();
    return `https://ficfac.app/api/files/${file?._id}`;
  }

  async findById(_id: Types.ObjectId) {
    const file = await this.FilesModel.findOne({ _id }).exec();
    if (!file) return file;

    await this.FilesModel.deleteOne({ _id });
    return file;
  }
}
