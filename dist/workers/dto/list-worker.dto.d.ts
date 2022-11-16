import { workerStatus } from './status.enum';
export declare class ListWorkerDto {
    readonly name: string;
    readonly dni: string;
    readonly email: string;
    readonly seguridad_social: string;
    readonly mobile: string;
    status?: workerStatus;
}
