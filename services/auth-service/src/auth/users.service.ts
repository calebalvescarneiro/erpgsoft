import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { TenantContext } from '../common/tenant-context.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { TenantsService } from '../tenants/tenants.service.js';
import { Role } from './roles.js';
import { User } from './user.entity.js';

const DEFAULT_INVITE_PASSWORD = 'ChangeMe123!';

interface UserRecord extends User {
  tenant: Tenant;
}

@Injectable()
export class UsersService {
  private readonly users = new Map<string, UserRecord>();

  constructor(
    private readonly tenantContext: TenantContext,
    private readonly tenantsService: TenantsService
  ) {
    this.seedDemoUsers();
  }

  private getTenant(): Tenant {
    const tenantId = this.tenantContext.getTenant();
    if (!tenantId) {
      throw new NotFoundException('Tenant context not available');
    }
    return this.tenantsService.findById(tenantId);
  }

  private seedDemoUsers() {
    const tenants = this.tenantsService.list();
    for (const tenant of tenants) {
      const passwordHash = bcrypt.hashSync(DEFAULT_INVITE_PASSWORD, 10);
      const demoUser: UserRecord = {
        id: randomUUID(),
        tenantId: tenant.id,
        email: 'demo@erpgsoft.com',
        passwordHash,
        roles: ['manager'],
        invitedAt: new Date(),
        tenant
      };
      this.users.set(`${tenant.id}:${demoUser.email}`, demoUser);
    }
  }

  async invite(email: string, roles: Role[], temporaryPassword?: string) {
    const tenant = this.getTenant();
    const password = temporaryPassword ?? DEFAULT_INVITE_PASSWORD;
    const passwordHash = await bcrypt.hash(password, 10);
    const user: UserRecord = {
      id: randomUUID(),
      tenantId: tenant.id,
      email: email.toLowerCase(),
      passwordHash,
      roles,
      invitedAt: new Date(),
      tenant
    };
    this.users.set(`${tenant.id}:${user.email}`, user);
    return { ...user, password: temporaryPassword ? undefined : password };
  }

  async register(email: string, password: string) {
    const tenant = this.getTenant();
    const key = `${tenant.id}:${email.toLowerCase()}`;
    const invited = this.users.get(key);
    if (!invited) {
      throw new NotFoundException('Invitation not found');
    }
    invited.passwordHash = await bcrypt.hash(password, 10);
    return { id: invited.id, email: invited.email, roles: invited.roles };
  }

  async validateCredentials(email: string, password: string) {
    const tenant = this.getTenant();
    const record = this.users.get(`${tenant.id}:${email.toLowerCase()}`);
    if (!record) {
      throw new NotFoundException('User not found');
    }
    const valid = await bcrypt.compare(password, record.passwordHash);
    if (!valid) {
      throw new NotFoundException('Invalid credentials');
    }
    record.lastLoginAt = new Date();
    return record;
  }

  listUsers() {
    const tenant = this.getTenant();
    return Array.from(this.users.values())
      .filter((user) => user.tenantId === tenant.id)
      .map(({ passwordHash, tenant: _tenant, ...rest }) => rest);
  }
}
