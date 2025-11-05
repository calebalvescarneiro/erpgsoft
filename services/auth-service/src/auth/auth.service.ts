import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_TTL_SECONDS } from '../common/constants.js';
import { TenantContext } from '../common/tenant-context.js';
import { Role } from './roles.js';
import { User } from './user.entity.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'insecure-demo-secret';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  tenantId: string;
  roles: Role[];
}

@Injectable()
export class AuthService {
  constructor(private readonly tenantContext: TenantContext) {}

  issueToken(user: User) {
    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: AUTH_TOKEN_TTL_SECONDS
    });

    return { accessToken, expiresIn: AUTH_TOKEN_TTL_SECONDS };
  }

  decode(token: string): AuthTokenPayload {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  }

  getCurrentTenant() {
    return this.tenantContext.getTenant();
  }
}
