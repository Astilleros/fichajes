import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(8, 20)
  readonly username: string;

  @IsString()
  @Length(8, 20)
  readonly password: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 50)
  readonly nombre?: string;

  @IsString()
  @Length(8, 12)
  readonly dni?: string;

  @IsString()
  @Length(8, 12)
  readonly mobile?: string;

  @IsString()
  @Length(8, 50)
  readonly empresa?: string;

  @IsString()
  @Length(8, 12)
  readonly cif?: string;

  @IsString()
  @Length(8, 50)
  readonly sede?: string;
}
