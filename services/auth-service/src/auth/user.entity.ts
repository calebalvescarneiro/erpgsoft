import { Role } from './roles.js';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  invitedAt: Date;
  lastLoginAt?: Date;
}
