export declare class EncriptService {
    constructor();
    hashUserPassword(password: string): Promise<string>;
    comparePasswords(raw: string, db: string): Promise<boolean>;
}
