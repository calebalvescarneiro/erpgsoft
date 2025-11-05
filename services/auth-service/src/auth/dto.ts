import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from './roles.js';

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsArray()
  roles!: Role[];

  @IsOptional()
  @IsString()
  temporaryPassword?: string;
}

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
