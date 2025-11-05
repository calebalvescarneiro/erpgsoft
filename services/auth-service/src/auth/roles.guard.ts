import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { canPerform, Role } from './roles.js';
import { AuthService } from './auth.service.js';
import { resolveTenantFromHeaders } from '../common/tenant-context.js';

export const ROLES_KEY = 'roles';
export const RequireRole = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = this.authService.decode(token);

    const tenantFromHeader = resolveTenantFromHeaders(request.headers);
    if (!tenantFromHeader) {
      throw new UnauthorizedException('Tenant header is required');
    }
    if (tenantFromHeader !== payload.tenantId) {
      throw new ForbiddenException('Tenant mismatch');
    }

    return requiredRoles.some((role) => payload.roles.some((assigned) => canPerform(role, assigned)));
  }
}
