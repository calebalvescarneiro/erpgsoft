import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext, resolveTenantFromHeaders } from './tenant-context.js';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContext: TenantContext) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const tenantId = resolveTenantFromHeaders(request.headers);
    if (!tenantId) {
      throw new UnauthorizedException('Tenant header is required');
    }
    this.tenantContext.setTenant(tenantId);
    return next.handle();
  }
}
