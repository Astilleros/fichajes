import { JwtPayload } from '../dto/jwtPayload.dto';
import { User } from 'src/user/entities/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(user: User): Promise<JwtPayload>;
}
export {};
