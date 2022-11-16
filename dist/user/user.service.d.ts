import { Model } from 'mongoose';
import { EncriptService } from 'src/encript/encript.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';
export declare class UserService {
    private readonly userModel;
    private encript;
    constructor(userModel: Model<UserDocument>, encript: EncriptService);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findOne(id: string): Promise<UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    remove(id: string): Promise<UserDocument>;
    findUsername(username: string): Promise<UserDocument>;
}
