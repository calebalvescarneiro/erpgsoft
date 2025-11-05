import { Injectable, NotFoundException } from '@nestjs/common';
import { Tenant } from './tenant.entity.js';

@Injectable()
export class TenantsService {
  private readonly tenants = new Map<string, Tenant>();

  constructor() {
    // Seed with demo tenants for pilot usage
    this.create({ id: 'demo-retail', name: 'Demo Retail', plan: 'growth', active: true });
    this.create({ id: 'demo-services', name: 'Demo Services', plan: 'start', active: true });
  }

  create(input: Tenant) {
    this.tenants.set(input.id, input);
    return input;
  }

  findById(id: string) {
    const tenant = this.tenants.get(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant ${id} not found`);
    }
    return tenant;
  }

  list() {
    return Array.from(this.tenants.values());
  }
}
