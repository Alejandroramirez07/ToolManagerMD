import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../../common/enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  role: Role; // Optional, can be set for initial Professor accounts
}