import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { BillingPlanCode, PLANS } from './plans.js';

export interface UsageSnapshot {
  periodStart: string;
  periodEnd: string;
  transactionsProcessed: number;
  transactionVolume: number;
}

export interface ChargeComputation {
  plan: BillingPlanCode;
  baseFee: number;
  includedTransactions: number;
  overageTransactions: number;
  transactionFeePercent: number;
  transactionFees: number;
  total: number;
}

@Injectable()
export class PricingService {
  getPlans() {
    return Object.values(PLANS);
  }

  computeTrialEnd(plan: BillingPlanCode, startDate = new Date()): string {
    const trialDays = PLANS[plan].trialDays;
    return dayjs(startDate).add(trialDays, 'day').toISOString();
  }

  computeCharge(plan: BillingPlanCode, usage: UsageSnapshot): ChargeComputation {
    const details = PLANS[plan];
    const overageTransactions = Math.max(usage.transactionsProcessed - details.includedTransactions, 0);
    const transactionFees = (usage.transactionVolume * details.transactionFeePercent) / 100;
    const total = details.monthlyFee + transactionFees;

    return {
      plan,
      baseFee: details.monthlyFee,
      includedTransactions: details.includedTransactions,
      overageTransactions,
      transactionFeePercent: details.transactionFeePercent,
      transactionFees,
      total
    };
  }

  getBillingCycle(date = new Date()) {
    const start = dayjs(date).startOf('month');
    const end = start.endOf('month');
    return { start: start.toISOString(), end: end.toISOString() };
  }
}
