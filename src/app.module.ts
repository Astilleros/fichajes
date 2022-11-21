import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WorkersModule } from './workers/workers.module';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CalendarService } from './calendar/calendar.service';
import { CalendarsModule } from './calendar/calendar.module';
import { FilesModule } from './files/files.module';
import { SignModule } from './sign/sign.module';
import { CheckinModule } from './checkin/checkin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/fichajes_db'),
    AuthModule,
    UserModule,
    WorkersModule,
    TasksModule,
    CalendarsModule,
    FilesModule,
    SignModule,
    CheckinModule
  ],
  controllers: [AppController],
  providers: [AppService, CalendarService],
})
export class AppModule {}
