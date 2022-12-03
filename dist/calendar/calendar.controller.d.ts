import { CalendarService } from './calendar.service';
import { WorkersService } from 'src/workers/workers.service';
export declare class CalendarController {
    private readonly CalendarService;
    private readonly workersService;
    constructor(CalendarService: CalendarService, workersService: WorkersService);
    watch(req: Request): Promise<void>;
    list(): Promise<import("googleapis").calendar_v3.Schema$CalendarListEntry[]>;
    deleteCalendar(calendarId: string): Promise<void>;
    deleteAcl(calendarId: string, aclId: string): Promise<import("gaxios").GaxiosResponse<void>>;
}
