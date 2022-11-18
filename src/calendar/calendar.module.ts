import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { WorkersModule } from 'src/workers/workers.module';

@Module({
  imports: [WorkersModule],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarService],
  exports: [CalendarService],
})
export class CalendarsModule {}
