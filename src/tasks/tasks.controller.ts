import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/AuthUser.decorator';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { Types } from 'mongoose';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@AuthUser() user: JwtPayload, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(user, createTaskDto);
  }

  @Get()
  findAll(@AuthUser() user: JwtPayload) {
    return this.tasksService.findAll(user._id);
  }

  @Get(':_id')
  findOne(@AuthUser() user: JwtPayload, @Param('_id') _id: Types.ObjectId) {
    return this.tasksService.findOne(user._id, _id);
  }

  @Patch(':_id')
  update(
    @AuthUser() user: JwtPayload,
    @Param('_id') _id: Types.ObjectId,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user._id, _id, updateTaskDto);
  }

  @Delete(':_id')
  remove(@AuthUser() user: JwtPayload, @Param('_id') _id: Types.ObjectId) {
    return this.tasksService.remove(user._id, _id);
  }

  /////// EDIT WORKERS RELATED

  @Post('/:_id/worker/:worker_id')
  addWorker(
    @AuthUser() user: JwtPayload,
    @Param('_id') _id: Types.ObjectId,
    @Param('worker_id') worker_id: Types.ObjectId,
  ) {
    return this.tasksService.addWorker(user._id, _id, worker_id);
  }
  @Delete('/:_id/worker/:worker_id')
  deleteWorker(
    @AuthUser() user: JwtPayload,
    @Param('_id') _id: Types.ObjectId,
    @Param('worker_id') worker_id: Types.ObjectId,
  ) {
    return this.tasksService.deleteWorker(user._id, _id, worker_id);
  }
}
