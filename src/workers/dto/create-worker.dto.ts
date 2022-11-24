import { workerModes } from './mode.enum';
import { workerStatus } from './status.enum';

export class CreateWorkerDto {
  name: string;
  dni: string;
  email: string;
  seguridad_social: string;
  mobile: string;
  status: workerStatus;
  sync: string;
  mode: workerModes
}
