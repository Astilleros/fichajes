import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from 'src/auth/dto/jwtPayload.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<User>;
    profile(user: JwtPayload): Promise<User>;
    update(user: JwtPayload, updateUserDto: UpdateUserDto): Promise<User>;
    remove(user: JwtPayload): Promise<User>;
}
