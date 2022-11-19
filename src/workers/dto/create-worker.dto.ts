import { workerModes } from './mode.enum';
import { workerStatus } from './status.enum';

export class CreateWorkerDto {
  readonly name: string;
  readonly dni: string;
  readonly email: string;
  readonly seguridad_social: string;
  readonly mobile: string;
  readonly status: workerStatus;
  readonly sync: string;
  readonly mode: workerModes
}
