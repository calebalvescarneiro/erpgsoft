import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDto, RecordTransactionDto } from './dto.js';
import { BillingService } from './billing.service.js';
import { PricingService } from '../pricing/pricing.service.js';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billing: BillingService,
    private readonly pricing: PricingService
  ) {}

  @Get('plans')
  getPlans() {
    return this.pricing.getPlans();
  }

  @Post('subscriptions')
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.billing.createSubscription(dto.tenantId, dto.plan);
  }

  @Get('subscriptions')
  listSubscriptions() {
    return this.billing.listSubscriptions();
  }

  @Post('subscriptions/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.billing.cancelSubscription(id);
  }

  @Get('subscriptions/:id/invoice')
  computeInvoice(@Param('id') id: string) {
    return this.billing.computeInvoice(id);
  }

  @Get('subscriptions/:id/transactions')
  listTransactions(@Param('id') id: string) {
    return this.billing.listTransactions(id);
  }

  @Post('transactions')
  recordTransaction(@Body() dto: RecordTransactionDto) {
    return this.billing.recordTransaction({
      subscriptionId: dto.subscriptionId,
      amount: dto.amount,
      type: dto.type,
      metadata: dto.metadata
    });
  }
}
