import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';
import { PricingService, UsageSnapshot } from '../pricing/pricing.service.js';
import { BillingPlanCode } from '../pricing/plans.js';
import { Subscription, TransactionRecord } from './subscription.entity.js';

interface UsageLedger {
  [subscriptionId: string]: UsageSnapshot;
}

@Injectable()
export class BillingService {
  private readonly subscriptions = new Map<string, Subscription>();
  private readonly transactions: TransactionRecord[] = [];
  private readonly usage: UsageLedger = {};

  constructor(private readonly pricing: PricingService) {}

  createSubscription(tenantId: string, plan: BillingPlanCode) {
    const now = dayjs();
    const subscription: Subscription = {
      id: randomUUID(),
      tenantId,
      plan,
      trialEndsAt: this.pricing.computeTrialEnd(plan, now.toDate()),
      active: true,
      startedAt: now.toISOString()
    };
    this.subscriptions.set(subscription.id, subscription);
    this.usage[subscription.id] = {
      periodStart: this.pricing.getBillingCycle(now.toDate()).start,
      periodEnd: this.pricing.getBillingCycle(now.toDate()).end,
      transactionsProcessed: 0,
      transactionVolume: 0
    };
    return subscription;
  }

  cancelSubscription(id: string) {
    const subscription = this.getSubscription(id);
    subscription.active = false;
    subscription.canceledAt = dayjs().toISOString();
    return subscription;
  }

  recordUsage(subscriptionId: string, transactions: number, volume: number) {
    const snapshot = this.usage[subscriptionId];
    if (!snapshot) {
      throw new NotFoundException('Usage snapshot not found');
    }
    snapshot.transactionsProcessed += transactions;
    snapshot.transactionVolume += volume;
    return snapshot;
  }

  recordTransaction(entry: { subscriptionId: string; amount: number; type: TransactionRecord['type']; metadata?: Record<string, unknown> }) {
    const subscription = this.getSubscription(entry.subscriptionId);
    const record: TransactionRecord = {
      id: randomUUID(),
      tenantId: subscription.tenantId,
      subscriptionId: entry.subscriptionId,
      amount: entry.amount,
      type: entry.type,
      occurredAt: dayjs().toISOString(),
      metadata: entry.metadata
    };
    this.transactions.push(record);
    return record;
  }

  computeInvoice(subscriptionId: string) {
    const subscription = this.getSubscription(subscriptionId);
    const usage = this.usage[subscriptionId];
    const billingCycle = this.pricing.getBillingCycle();
    const charge = this.pricing.computeCharge(subscription.plan, usage);
    return {
      subscription,
      billingCycle,
      usage,
      charge
    };
  }

  listSubscriptions() {
    return Array.from(this.subscriptions.values());
  }

  listTransactions(subscriptionId?: string) {
    if (!subscriptionId) {
      return this.transactions;
    }
    return this.transactions.filter((tx) => tx.subscriptionId === subscriptionId);
  }

  private getSubscription(id: string) {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }
}
