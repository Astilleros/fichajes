import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
import { CalendarService } from 'src/calendar/calendar.service';
import { WorkersService } from 'src/workers/workers.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private workerService: WorkersService,
    private calendarService: CalendarService,
  ) {}

  async create(
    user: JwtPayload,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskDocument> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      user: user._id,
    });

    const calendar = await this.calendarService.createCalendar({
      summary: `FicharFacil ${createdTask.name}`,
      description: `Calendario creado por FicharFacil para el puesto de trabajo ${createdTask.name}. Aquí registrará cada periodo a trabajar por cada trabajador. `,
      timeZone: 'Europe/Madrid',
    });

    createdTask.calendar = calendar.id;
    await createdTask.save();
    if (user.email)
      await this.calendarService.shareCalendar(
        createdTask.calendar,
        user.email,
      );

    return createdTask.save();
  }

  findAll(user_id: Types.ObjectId): Promise<TaskDocument[]> {
    return this.taskModel.find({ user: user_id }).exec();
  }

  findOne(user_id: Types.ObjectId, _id: Types.ObjectId) {
    return this.taskModel.findOne({ _id, user: user_id }).exec();
  }

  update(
    user_id: Types.ObjectId,
    _id: Types.ObjectId,
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskModel
      .findOneAndUpdate({ _id, user: user_id }, updateTaskDto, { new: true })
      .exec();
  }

  remove(user_id: Types.ObjectId, _id: Types.ObjectId) {
    return this.taskModel.findOneAndDelete({ _id, user: user_id }).exec();
  }

  async addWorker(
    user_id: Types.ObjectId,
    _id: Types.ObjectId,
    worker_id: Types.ObjectId,
  ) {
    const validWorker = await this.workerService.findOne(user_id, worker_id);
    if (!validWorker?.email)
      throw new Error('Intentando añadir trabajador no vinculado.');

    const taskUpdated = await this.taskModel
      .findOneAndUpdate(
        { _id, user: user_id },
        { $push: { workers: worker_id } },
        { new: true },
      )
      .exec();

    await this.calendarService.shareCalendar(
      taskUpdated.calendar,
      validWorker.email,
    );
    return taskUpdated;
  }

  async deleteWorker(
    user_id: Types.ObjectId,
    task_id: Types.ObjectId,
    worker_id: Types.ObjectId,
  ) {
    const validWorker = await this.workerService.findOne(user_id, worker_id);
    if (!validWorker)
      throw new Error('Intentando eliminar trabajador no vinculado.');

    const taskUpdated = await this.taskModel
      .findOneAndUpdate(
        { _id: task_id, user: user_id },
        { $pull: { workers: worker_id } },
        { new: true },
      )
      .exec();

    await this.calendarService.unshareCalendar(
      taskUpdated.calendar,
      validWorker.email,
    );

    return taskUpdated;
  }
}
