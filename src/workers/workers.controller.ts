import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Response,
  Res,
  Header,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { AuthUser } from 'src/auth/decorators/AuthUser.decorator';
import { Types } from 'mongoose';

@Controller('workers')
@UseGuards(JwtAuthGuard)
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  create(
    @AuthUser() user: JwtPayload,
    @Body() createWorkerDto: CreateWorkerDto,
  ) {
    return this.workersService.create(user, createWorkerDto);
  }

  @Get()
  findAll(@AuthUser() user: JwtPayload) {
    return this.workersService.findAll(user);
  }

  @Get('events')
  filterEvents(
    @AuthUser() user: JwtPayload,
    @Query('worker_id') worker_id: Types.ObjectId,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.workersService.filterEvents(user, worker_id, start, end);
  }

  @Get(':_id')
  findOne(@AuthUser() user: JwtPayload, @Param('_id') _id: Types.ObjectId) {
    return this.workersService.findOne(user._id, _id);
  }

  @Patch(':_id')
  update(
    @AuthUser() user: JwtPayload,
    @Param('_id') _id: Types.ObjectId,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.workersService.update(user._id, _id, updateWorkerDto);
  }

  @Delete(':_id')
  remove(@AuthUser() user: JwtPayload, @Param('_id') _id: Types.ObjectId) {
    return this.workersService.remove(user._id, _id);
  }

  @Get('/share/:_id')
  shareCalendar(
    @AuthUser() user: JwtPayload,
    @Param('id') _id: Types.ObjectId,
  ) {
    return this.workersService.shareCalendar(user._id, _id);
  }

  @Get('/unshare/:_id')
  unshareCalendar(
    @AuthUser() user: JwtPayload,
    @Param('_id') _id: Types.ObjectId,
  ) {
    return this.workersService.unshareCalendar(user._id, _id);
  }

  @Get('/generate/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="package.pdf"')
  generatePdf(
    @AuthUser() user: JwtPayload,
    @Query('worker_id') worker_id: Types.ObjectId,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.workersService.generatePdfToSign(user, worker_id, start, end);
  }
}
