import { Injectable } from '@nestjs/common';
import { CreateSignDto } from './dto/create-sign.dto';
import { UpdateSignDto } from './dto/update-sign.dto';

@Injectable()
export class SignService {
  create(createSignDto: CreateSignDto) {
    return 'This action adds a new sign';
  }

  findAll() {
    return `This action returns all sign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sign`;
  }

  update(id: number, updateSignDto: UpdateSignDto) {
    return `This action updates a #${id} sign`;
  }

  remove(id: number) {
    return `This action removes a #${id} sign`;
  }
}
