import { Model } from 'mongoose';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckinDocument } from './entities/checkin.entity';
export declare class CheckinService {
    private CheckinModel;
    constructor(CheckinModel: Model<CheckinDocument>);
    create(checkinDate: CreateCheckinDto): Promise<CheckinDocument>;
    findByWorker(worker: string): Promise<CheckinDocument>;
    delete(_id: string): Promise<void>;
}
