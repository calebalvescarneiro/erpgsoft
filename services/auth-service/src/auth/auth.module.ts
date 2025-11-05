import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TenantContext } from '../common/tenant-context.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RolesGuard } from './roles.guard.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TenantsModule],
  controllers: [AuthController],
  providers: [TenantContext, UsersService, AuthService, { provide: APP_GUARD, useClass: RolesGuard }]
})
export class AuthModule {}
