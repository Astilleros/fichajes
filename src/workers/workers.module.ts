import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from './entities/worker.entity';
import { CalendarService } from 'src/calendar/calendar.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
    UserModule,
  ],
  controllers: [WorkersController],
  providers: [WorkersService, CalendarService],
  exports: [WorkersService],
})
export class WorkersModule {}
