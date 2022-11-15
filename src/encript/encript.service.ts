import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class EncriptService {
    constructor(){}
    async hashUserPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(raw:string, db: string): Promise<boolean> {
        return await bcrypt.compare(raw, db)
    }
}
