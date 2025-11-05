export type Role = 'owner' | 'manager' | 'cashier' | 'viewer';

export const ROLE_HIERARCHY: Role[] = ['viewer', 'cashier', 'manager', 'owner'];

export function canPerform(required: Role, role: Role) {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(required);
}
