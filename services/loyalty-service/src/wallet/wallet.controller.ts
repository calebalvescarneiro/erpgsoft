import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  AdjustBalanceDto,
  CreateWalletDto,
  IssueGiftCardDto,
  RecordAccrualDto,
  RedeemWalletDto
} from './dto.js';
import { WalletService } from './wallet.service.js';

@Controller('wallets')
export class WalletController {
  constructor(private readonly wallets: WalletService) {}

  @Post()
  create(@Body() payload: CreateWalletDto) {
    return this.wallets.createWallet(payload);
  }

  @Get()
  list(@Query('tenantId') tenantId?: string) {
    return this.wallets.listWallets(tenantId);
  }

  @Post('accrual')
  accrue(@Body() payload: RecordAccrualDto) {
    return this.wallets.recordAccrual(payload);
  }

  @Post('redeem')
  redeem(@Body() payload: RedeemWalletDto) {
    return this.wallets.redeem(payload);
  }

  @Post('gift-card')
  issueGiftCard(@Body() payload: IssueGiftCardDto) {
    return this.wallets.issueGiftCard(payload);
  }

  @Post('adjust')
  adjust(@Body() payload: AdjustBalanceDto) {
    return this.wallets.adjustBalance(payload);
  }

  @Get(':id/transactions')
  transactions(@Param('id') id: string) {
    return this.wallets.listTransactions(id);
  }
}
