import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Files, FilesDocument } from './entities/files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files.name) private FilesModel: Model<FilesDocument>,
  ) {}

  async create(filename: string, data: string): Promise<string> {
    console.log('FilesService.create', filename, data.length);
    let file = new this.FilesModel({
      filename,
      data,
    });
    file = await file.save();
    console.log('file', file._id);
    
    return `https://ficfac.app/api/files/${file?._id}`;
  }

  async findById(_id: string) {
    const file = await this.FilesModel.findOne({ _id }).exec();
    if (!file) return file;
 
    await this.FilesModel.deleteOne({ _id }); 
    return file;
  }
}
