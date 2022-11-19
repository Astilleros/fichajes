import { WorkersService } from 'src/workers/workers.service';
import { CalendarService } from './calendar.service';
export declare class CalendarController {
    private readonly calendarService;
    private readonly workersService;
    constructor(calendarService: CalendarService, workersService: WorkersService);
    watch(req: Request): Promise<void>;
}
