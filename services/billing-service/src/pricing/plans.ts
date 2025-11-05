export type BillingPlanCode = 'start' | 'growth' | 'scale';

export interface BillingPlan {
  code: BillingPlanCode;
  name: string;
  monthlyFee: number;
  trialDays: number;
  transactionFeePercent: number;
  includedTransactions: number;
}

export const PLANS: Record<BillingPlanCode, BillingPlan> = {
  start: {
    code: 'start',
    name: 'Start',
    monthlyFee: 99,
    trialDays: 14,
    transactionFeePercent: 1.9,
    includedTransactions: 500
  },
  growth: {
    code: 'growth',
    name: 'Growth',
    monthlyFee: 249,
    trialDays: 21,
    transactionFeePercent: 1.6,
    includedTransactions: 2000
  },
  scale: {
    code: 'scale',
    name: 'Scale',
    monthlyFee: 499,
    trialDays: 30,
    transactionFeePercent: 1.3,
    includedTransactions: 10000
  }
};
