import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { CalendarService } from 'src/calendar/calendar.service';
import { Types } from 'mongoose';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly calendarService: CalendarService,
  ) {}

  @Get(':_id')
  async findOne(@Res() res: Response, @Param('_id') _id: Types.ObjectId) {
    const file = await this.filesService.findById(_id);
    if (!file) return;
    await this.calendarService.deleteEvent(file.calendar, file.event);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.filename + '.pdf'}"`,
    });
    return res.send(file.data);
  }
}
