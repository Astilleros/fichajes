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
  UseInterceptors,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { AuthUser } from 'src/auth/decorators/AuthUser.decorator';
import { Types } from 'mongoose';
import { Worker } from './entities/worker.entity';
import MongooseClassSerializerInterceptor from 'src/core/interceptors/MongooseClassSerializer.interceptor';
import { EncloseId } from 'src/core/decorators/EncloseId.decorator';

@Controller('workers')
@UseGuards(JwtAuthGuard)
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @UseInterceptors(MongooseClassSerializerInterceptor(Worker))
  create(
    @AuthUser() user: JwtPayload,
    @Body() createWorkerDto: CreateWorkerDto,
  ): Promise<Worker> {
    return this.workersService.create(user, createWorkerDto);
  }

  @Get()
  @UseInterceptors(MongooseClassSerializerInterceptor(Worker))
  findAll(@AuthUser() user: JwtPayload): Promise<Worker[]> {
    return this.workersService.findAll(user);
  }

  @Get('events')
  filterEvents(
    @AuthUser() user: JwtPayload,
    @Query('worker_id', EncloseId) worker_id: Types.ObjectId,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.workersService.filterEvents(user, worker_id, start, end);
  }

  @Get(':_id')
  @UseInterceptors(MongooseClassSerializerInterceptor(Worker))
  findOne(
    @AuthUser() user: JwtPayload,
    @Param('_id', EncloseId) _id: Types.ObjectId,
  ) {
    return this.workersService.findOne(user._id, _id);
  }

  @Patch(':_id')
  @UseInterceptors(MongooseClassSerializerInterceptor(Worker))
  update(
    @AuthUser() user: JwtPayload,
    @Param('_id', EncloseId) _id: Types.ObjectId,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.workersService.update(user._id, _id, updateWorkerDto);
  }

  @Delete(':_id')
  remove(
    @AuthUser() user: JwtPayload,
    @Param('_id', EncloseId) _id: Types.ObjectId,
  ) {
    return this.workersService.remove(user._id, _id);
  }

  @Get('/share/:worker_id')
  shareCalendar(
    @AuthUser() user: JwtPayload,
    @Param('worker_id', EncloseId) worker_id: Types.ObjectId,
  ) {
    return this.workersService.shareCalendar(user._id, worker_id);
  }

  @Get('/unshare/:worker_id')
  unshareCalendar(
    @AuthUser() user: JwtPayload,
    @Param('worker_id', EncloseId) worker_id: Types.ObjectId,
  ) {
    return this.workersService.unshareCalendar(user._id, worker_id);
  }

  @Get('/generate/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="package.pdf"')
  generatePdf(
    @AuthUser() user: JwtPayload,
    @Query('worker_id', EncloseId) worker_id: Types.ObjectId,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.workersService.generatePdfToSign(user, worker_id, start, end);
  }
}
