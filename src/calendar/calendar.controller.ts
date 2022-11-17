/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Request } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('watch')
  create(@Request() req: Request, @Body() data: any) {
    console.log('watch: ',req.url,JSON.stringify(req.headers, null, 2), data);
  };
}
