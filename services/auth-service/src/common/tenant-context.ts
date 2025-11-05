import { Injectable, Scope } from '@nestjs/common';
import { TENANT_HEADER } from './constants.js';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private tenantId: string | null = null;

  setTenant(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenant() {
    return this.tenantId;
  }
}

export function resolveTenantFromHeaders(headers: Record<string, string | string[] | undefined>) {
  const raw = headers[TENANT_HEADER];
  if (!raw) {
    return null;
  }
  return Array.isArray(raw) ? raw[0] : raw;
}
