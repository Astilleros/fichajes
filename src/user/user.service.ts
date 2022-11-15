import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EncriptService } from 'src/encript/encript.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private encript: EncriptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = { ...createUserDto };
    user.password = await this.encript.hashUserPassword(user.password);
    return await this.userModel.create(user);
  }

  async findOne(id: string): Promise<UserDocument> {
    return await this.userModel.findOne({ _id: id }).lean();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const update = { ...updateUserDto };
    if (update.password)
      update.password = await this.encript.hashUserPassword(update.password);
    return await this.userModel
      .findOneAndUpdate({ _id: id }, update, { new: true })
      .lean();
  }

  async remove(id: string): Promise<UserDocument> {
    return await this.userModel.findOneAndDelete({ _id: id }).lean();
  }

  async findUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username }, '+password').lean();
  }
}
