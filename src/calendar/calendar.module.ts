import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';

@Module({
  imports: [],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarService],
  exports: [CalendarService],
})
export class CalendarsModule {}
