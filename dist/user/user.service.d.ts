import { Model, Types } from 'mongoose';
import { EncriptService } from 'src/encript/encript.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';
export declare class UserService {
    private readonly userModel;
    private encript;
    constructor(userModel: Model<UserDocument>, encript: EncriptService);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findOne(id: Types.ObjectId): Promise<UserDocument>;
    update(id: Types.ObjectId, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    remove(id: Types.ObjectId): Promise<UserDocument>;
    findUsername(username: string): Promise<UserDocument>;
}
