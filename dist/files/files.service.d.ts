import { Model } from 'mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { Files, FilesDocument } from './entities/files.entity';
export declare class FilesService {
    private FilesModel;
    constructor(FilesModel: Model<FilesDocument>);
    create(data: CreateFileDto): Promise<string>;
    findById(_id: string): Promise<Files & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
