import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module.js';

@Module({
  imports: [BillingModule]
})
export class AppModule {}
