export type TenantPlan = 'start' | 'growth' | 'scale';

export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  active: boolean;
  metadata?: Record<string, unknown>;
}
