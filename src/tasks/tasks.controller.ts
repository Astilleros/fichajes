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

  @Get(':id')
  findOne(@AuthUser() user: JwtPayload, @Param('id') id: string) {
    return this.tasksService.findOne(user._id, id);
  }

  @Patch(':id')
  update(
    @AuthUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user._id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@AuthUser() user: JwtPayload, @Param('id') id: string) {
    return this.tasksService.remove(user._id, id);
  }

  /////// EDIT WORKERS RELATED

  @Post('/:id/worker/:worker_id')
  addWorker(
    @AuthUser() user: JwtPayload,
    @Param('id') id: string,
    @Param('worker_id') worker_id: string,
  ) {
    return this.tasksService.addWorker(user._id, id, worker_id);
  }
  @Delete('/:id/worker/:worker_id')
  deleteWorker(
    @AuthUser() user: JwtPayload,
    @Param('id') id: string,
    @Param('worker_id') worker_id: string,
  ) {
    return this.tasksService.deleteWorker(user._id, id, worker_id);
  }
}
