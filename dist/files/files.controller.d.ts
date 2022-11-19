import { FilesService } from './files.service';
import { Response } from 'express';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    findOne(res: Response, id: string): Promise<Response<any, Record<string, any>>>;
}
