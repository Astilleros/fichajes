import { FilesService } from './files.service';
import { Response } from 'express';
import { CalendarService } from 'src/calendar/calendar.service';
import { Types } from 'mongoose';
export declare class FilesController {
    private readonly filesService;
    private readonly calendarService;
    constructor(filesService: FilesService, calendarService: CalendarService);
    findOne(res: Response, _id: Types.ObjectId): Promise<Response<any, Record<string, any>>>;
}
