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
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { CheckoutsModule } from './stripe/checkouts/checkouts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: __dirname + '/.env',
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1/fichajes_db'),
    AuthModule,
    UserModule,
    WorkersModule,
    TasksModule,
    CalendarsModule,
    FilesModule,
    SignModule,
    CheckinModule,
    StripeModule,
    CheckoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CalendarService],
})
export class AppModule {}
