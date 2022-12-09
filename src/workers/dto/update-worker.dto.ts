import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Max, Min } from 'class-validator';
import { CreateWorkerDto } from './create-worker.dto';
import { workerModes } from './mode.enum';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsNumber()
  @Min(0)
  @Max(4)
  readonly mode: workerModes;
}
