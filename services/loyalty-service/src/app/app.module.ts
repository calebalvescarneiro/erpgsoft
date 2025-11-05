import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module.js';

@Module({
  imports: [WalletModule]
})
export class AppModule {}
