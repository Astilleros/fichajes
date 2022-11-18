/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { workerStatus } from 'src/workers/dto/status.enum';
import { WorkersService } from 'src/workers/workers.service';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly workersService: WorkersService,
  ) {}

  @Post('watch')
  async create(@Request() req: Request) {
    const status = req.headers['x-goog-resource-state'];
    if (status != 'exists') return;

    const calendarId = req.headers['x-goog-channel-id']
      .replace('-', '@')
      .replace(/\_/g, '.');

    const worker = await this.workersService.getWorkerByCalendar(calendarId);
    if(!worker) throw new Error('No encuentra en worker')
    console.log(worker);
    
    const sync = new Date().toISOString();
    const new_events = await this.calendarService.getChanges(
      calendarId,
      worker.sync,
    );

    for (let i = 0; i < new_events.length; i++) {
      const e = new_events[i];
      if (!e.start.date) continue;

      if (e.summary === '@vincular') {
        if (worker.status === workerStatus.pending) {
          await this.workersService.update(worker.user, worker._id, {
            status: workerStatus.linked,
          });
          await this.calendarService.updateEvent(worker.calendar, e.id, {
            summary: 'Vinculado corectamente',
          });
        } else if (worker.status === workerStatus.linked) {
          await this.calendarService.updateEvent(worker.calendar, e.id, {
            summary: 'Calendario ya vinculado.',
          });
        }
      }
    }

    await this.workersService.update(worker.user, worker._id, { sync });
  }

}
