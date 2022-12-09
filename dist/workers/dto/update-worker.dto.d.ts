import { CreateWorkerDto } from './create-worker.dto';
import { workerModes } from './mode.enum';
declare const UpdateWorkerDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateWorkerDto>>;
export declare class UpdateWorkerDto extends UpdateWorkerDto_base {
    readonly mode: workerModes;
}
export {};
