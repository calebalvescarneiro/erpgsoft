import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BillingPlanCode } from '../pricing/plans.js';

export class CreateSubscriptionDto {
  @IsString()
  tenantId!: string;

  @IsEnum(['start', 'growth', 'scale'], { message: 'plan must be start, growth or scale' })
  plan!: BillingPlanCode;
}

export class RecordTransactionDto {
  @IsString()
  subscriptionId!: string;

  @IsNumber()
  amount!: number;

  @IsEnum(['subscription_fee', 'transaction_fee'])
  type!: 'subscription_fee' | 'transaction_fee';

  @IsOptional()
  metadata?: Record<string, unknown>;
}
