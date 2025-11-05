import { BillingPlanCode } from '../pricing/plans.js';

export interface Subscription {
  id: string;
  tenantId: string;
  plan: BillingPlanCode;
  trialEndsAt: string;
  active: boolean;
  startedAt: string;
  canceledAt?: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionRecord {
  id: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  type: 'subscription_fee' | 'transaction_fee';
  occurredAt: string;
  metadata?: Record<string, unknown>;
}
