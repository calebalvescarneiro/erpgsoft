import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { TenantInterceptor } from '../common/tenant.interceptor.js';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterUserDto, InviteUserDto } from './dto.js';
import { RequireRole, RolesGuard } from './roles.guard.js';
import { UsersService } from './users.service.js';

@Controller('auth')
@UseInterceptors(TenantInterceptor)
export class AuthController {
  constructor(private readonly users: UsersService, private readonly auth: AuthService) {}

  @Post('invite')
  @UseGuards(RolesGuard)
  @RequireRole('manager')
  invite(@Body() dto: InviteUserDto) {
    return this.users.invite(dto.email, dto.roles, dto.temporaryPassword);
  }

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.users.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.users.validateCredentials(dto.email, dto.password);
    return this.auth.issueToken(user);
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @RequireRole('manager')
  listUsers() {
    return this.users.listUsers();
  }
}
