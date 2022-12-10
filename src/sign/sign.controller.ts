import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SignService } from './sign.service';
import { CreateSignDto } from './dto/create-sign.dto';
import { Types } from 'mongoose';
import { EncloseId } from 'src/core/decorators/EncloseId.decorator';

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post()
  create(@Body() createSignDto: CreateSignDto) {
    return this.signService.create(createSignDto);
  }

  @Get(':_id')
  findById(@Param('_id', EncloseId) _id: Types.ObjectId) {
    return this.signService.findById(_id);
  }
}
