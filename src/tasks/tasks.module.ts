import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { WorkersModule } from 'src/workers/workers.module';
import { CalendarService } from 'src/calendar/calendar.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    WorkersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, CalendarService],
})
export class TasksModule {}
