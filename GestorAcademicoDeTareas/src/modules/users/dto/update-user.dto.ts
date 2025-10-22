import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { Role } from '../../../common/enums/roles.enum';

// Inherits all properties from CreateUserDto and makes them optional
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // The role field can be explicitly included for role updates by an admin/professor
  @IsOptional()
  role?: Role;
}