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
  async watch(@Request() req: Request) {
    const status = req.headers['x-goog-resource-state'];
    if (status != 'exists') return;
    console.log('status',status);
    
    console.log(req.headers['x-goog-channel-id']);
    const calendarId = req.headers['x-goog-channel-id']
      .replace('-', '@')
      .replace(/\_/g, '.');
    
      console.log('replaced ',req.headers['x-goog-channel-id']);

    const worker = await this.workersService.getWorkerByCalendar(calendarId);
    if(!worker) throw new Error('No encuentra en worker')
    if(worker.locked === true) throw new Error('Syncronización de trabajador bloqueada.')
    else {
      worker.locked = true;
      await worker.save()
    }
    console.log('worker',worker);
    
    
    const new_events = await this.calendarService.getChanges(
      calendarId,
      worker.sync,
    );
    
    let last_updated = 0;
    for (let i = 0; i < new_events.length; i++) {
      const e = new_events[i];
      console.log(e);
      const updated = new Date(e.updated?? e.created).getTime()
      if(last_updated < updated) last_updated = updated;
      await this.workersService.watchEvent(worker, e)
    }

    const sync = new Date(last_updated).toISOString();
    console.log('new sync', sync);
    await this.workersService.update(worker.user, worker._id, { sync, locked: false });
  }

}
