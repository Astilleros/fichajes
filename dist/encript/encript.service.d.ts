export declare class EncriptService {
    hashUserPassword(password: string): Promise<string>;
    comparePasswords(raw: string, db: string): Promise<boolean>;
}
