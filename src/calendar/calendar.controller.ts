/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { WorkersService } from 'src/workers/workers.service';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly CalendarService: CalendarService,
    private readonly workersService: WorkersService,
  ) {}

  @Post('watch')
  async watch(@Request() req: Request) {
    const status = req.headers['x-goog-resource-state'];
    console.log('1- WEBHOOK WATCH, status: ', status);
    if (status != 'exists') return;

    const calendarId = req.headers['x-goog-channel-id']
      .replace('-', '@')
      .replace(/\_/g, '.');

    console.log('2- replaced calendarId: ', calendarId);

    const worker = await this.workersService.getWorkerByCalendar(calendarId);
    if (!worker) throw new Error('No encuentra en worker');
    if (worker.locked === true)
      throw new Error('Syncronización de trabajador bloqueada.');
    else {
      worker.locked = true;
      await worker.save();
    }

    console.log('3- worker & mode: ', worker.name, worker.mode, worker.locked);

    const new_events = await this.CalendarService.getChanges(
      calendarId,
      worker.sync,
    );

    let last_updated = 0;
    for (let i = 0; i < new_events.length; i++) {
      const e = new_events[i];
      console.log('4- evento: ',e.summary, e.start, e.end, Object.keys(e).length);
      const updated = new Date(e.updated ?? e.created).getTime();
      if (last_updated < updated) last_updated = updated;
      await this.workersService.watchEvent(worker, e);
    }
    if(!last_updated) last_updated = new Date(worker.sync).getTime()
    const sync = new Date(last_updated).toISOString();
    console.log('5- new sync from date: ', sync);
    await this.workersService.update(worker.user, worker._id, {
      sync,
      locked: false,
    });
  }

  @Get('list')
  async list() {
    const calendars = await this.CalendarService.getCalendars();
    for (let i = 0; i < calendars.length; i++) {
      const c: any = calendars[i];
      c.shared = await this.CalendarService.getSharedAccounts(c.id);
      c.user = await this.workersService.getWorkerByCalendar(c.id);
    }
    return calendars;
  }

  @Delete(':calendarId')
  async deleteCalendar(
    @Param('calendarId') calendarId: string,
  ){
    return await this.CalendarService.deleteCalendar(calendarId )
  }

  @Delete('acl/:calendarId/:aclId')
  async deleteAcl(
    @Param('calendarId') calendarId: string,
    @Param('aclId') aclId: string,
  ){
    return await this.CalendarService.deleteAcl(calendarId, aclId )
  }
}
