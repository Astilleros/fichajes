import { Model, Types } from 'mongoose';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckinDocument } from './entities/checkin.entity';
export declare class CheckinService {
    private CheckinModel;
    constructor(CheckinModel: Model<CheckinDocument>);
    create(checkinDate: CreateCheckinDto): Promise<CheckinDocument>;
    findByWorker(worker: Types.ObjectId): Promise<CheckinDocument>;
    delete(_id: Types.ObjectId): Promise<void>;
}
