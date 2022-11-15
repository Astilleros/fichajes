import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WorkersModule } from './workers/workers.module';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CalendarService } from './calendar/calendar.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/fichajes_db'),
    AuthModule,
    UserModule,
    WorkersModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, CalendarService],
})
export class AppModule {}
