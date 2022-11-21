import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { CalendarService } from 'src/calendar/calendar.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly calendarService: CalendarService,
  ) {}

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const file = await this.filesService.findById(id);
    if (!file) return;
    await this.calendarService.deleteEvent(file.calendar, file.event);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.filename + '.pdf'}"`,
    });
    return res.send(file.data);
  }
}
