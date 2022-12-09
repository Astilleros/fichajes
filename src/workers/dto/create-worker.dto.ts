import { IsEmail, IsString, Length } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @Length(8, 50)
  readonly name: string;

  @IsString()
  @Length(8, 11)
  readonly dni: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 11)
  readonly seguridad_social: string;

  @IsString()
  @Length(8, 11)
  readonly mobile: string;
}
