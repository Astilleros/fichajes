import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SignService } from './sign.service';
import { CreateSignDto } from './dto/create-sign.dto';

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post()
  create(@Body() createSignDto: CreateSignDto) {
    return this.signService.create(createSignDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.signService.findById(id);
  }
}
