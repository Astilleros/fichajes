import { FilesService } from './files.service';
import { Response } from 'express';
import { CalendarService } from 'src/calendar/calendar.service';
export declare class FilesController {
    private readonly filesService;
    private readonly calendarService;
    constructor(filesService: FilesService, calendarService: CalendarService);
    findOne(res: Response, id: string): Promise<Response<any, Record<string, any>>>;
}
