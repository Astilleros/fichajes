import type { calendar_v3 } from 'googleapis';
import { workerStatus } from './status.enum';

export class ListWorkerDto {
  readonly name: string;
  readonly dni: string;
  readonly email: string;
  readonly seguridad_social: string;
  readonly mobile: string;
  status?: workerStatus;
}
