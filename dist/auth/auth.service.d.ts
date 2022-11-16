import { JwtService } from '@nestjs/jwt';
import { EncriptService } from 'src/encript/encript.service';
import { UserDocument } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    private encrip;
    constructor(userService: UserService, jwtService: JwtService, encrip: EncriptService);
    validateUser(username: string, pass: string): Promise<any>;
    generateAccessToken(user: UserDocument): Promise<{
        access_token: string;
        user: UserDocument;
    }>;
}
