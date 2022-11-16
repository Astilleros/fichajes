import { JwtPayload } from '../dto/jwtPayload.dto';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(user: any): Promise<JwtPayload>;
}
export {};
