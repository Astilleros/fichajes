import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignService } from './sign.service';
import { CreateSignDto } from './dto/create-sign.dto';
import { UpdateSignDto } from './dto/update-sign.dto';

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post()
  create(@Body() createSignDto: CreateSignDto) {
    return this.signService.create(createSignDto);
  }

  @Get()
  findAll() {
    return this.signService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.signService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSignDto: UpdateSignDto) {
    return this.signService.update(+id, updateSignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signService.remove(+id);
  }
}
