import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { resolveProgram } from '../programs/program-catalog.js';
import {
  AdjustBalanceDto,
  CreateWalletDto,
  IssueGiftCardDto,
  RecordAccrualDto,
  RedeemWalletDto,
  WalletTransactionItemDto
} from './dto.js';

export type WalletBalance = Record<'POINTS' | 'CASHBACK' | 'GIFT_CARD', number>;

export interface Wallet {
  id: string;
  tenantId: string;
  customerId: string;
  balances: WalletBalance;
  programId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionItemDto['type'];
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  occurredAt: string;
  reference?: string;
}

@Injectable()
export class WalletService {
  private readonly wallets = new Map<string, Wallet>();
  private readonly transactions: WalletTransaction[] = [];

  createWallet(payload: CreateWalletDto) {
    const programId = payload.programId ?? 'default-points';
    resolveProgram(programId);
    const wallet: Wallet = {
      id: randomUUID(),
      tenantId: payload.tenantId,
      customerId: payload.customerId,
      balances: {
        POINTS: 0,
        CASHBACK: 0,
        GIFT_CARD: 0
      },
      programId,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString()
    };
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  listWallets(tenantId?: string) {
    const wallets = Array.from(this.wallets.values());
    if (!tenantId) {
      return wallets;
    }
    return wallets.filter((wallet) => wallet.tenantId === tenantId);
  }

  recordAccrual(payload: RecordAccrualDto) {
    const wallet = this.getWallet(payload.walletId);
    const program = resolveProgram(payload.programId ?? wallet.programId);
    if (payload.purchaseValue < program.accrualRule.minimumPurchase) {
      return { wallet, transaction: undefined } as const;
    }
    const earned = payload.purchaseValue * program.accrualRule.multiplier;
    this.applyCredit(wallet, program.rewardType, earned, {
      reference: 'purchase-accrual'
    });
    wallet.updatedAt = dayjs().toISOString();
    return { wallet, earned, program } as const;
  }

  redeem(payload: RedeemWalletDto) {
    const wallet = this.getWallet(payload.walletId);
    payload.items.forEach((item) => {
      this.ensureBalance(wallet, item.type, item.amount);
      this.appendTransaction(wallet, item.type, item.amount, 'DEBIT', item.reference);
      wallet.balances[item.type] -= item.amount;
    });
    wallet.updatedAt = dayjs().toISOString();
    return wallet;
  }

  issueGiftCard(payload: IssueGiftCardDto) {
    const wallet = this.getWallet(payload.walletId);
    this.ensureBalance(wallet, 'POINTS', payload.value);
    this.appendTransaction(wallet, 'POINTS', payload.value, 'DEBIT', payload.reference ?? 'gift-card');
    wallet.balances.POINTS -= payload.value;
    this.applyCredit(wallet, 'GIFT_CARD', payload.value, {
      reference: payload.reference ?? 'gift-card'
    });
    wallet.updatedAt = dayjs().toISOString();
    return wallet;
  }

  adjustBalance(payload: AdjustBalanceDto) {
    const wallet = this.getWallet(payload.walletId);
    const current = wallet.balances[payload.type];
    const delta = payload.amount - current;
    if (delta > 0) {
      this.applyCredit(wallet, payload.type, delta, { reference: payload.reason ?? 'adjustment' });
    } else if (delta < 0) {
      this.ensureBalance(wallet, payload.type, -delta);
      this.appendTransaction(wallet, payload.type, -delta, 'DEBIT', payload.reason ?? 'adjustment');
      wallet.balances[payload.type] += delta;
    }
    wallet.updatedAt = dayjs().toISOString();
    return wallet;
  }

  listTransactions(walletId: string) {
    this.getWallet(walletId);
    return this.transactions.filter((tx) => tx.walletId === walletId);
  }

  private getWallet(id: string) {
    const wallet = this.wallets.get(id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  private ensureBalance(wallet: Wallet, type: keyof WalletBalance, amount: number) {
    if (wallet.balances[type] < amount) {
      throw new Error(`Insufficient ${type} balance`);
    }
  }

  private applyCredit(
    wallet: Wallet,
    type: keyof WalletBalance,
    amount: number,
    metadata?: { reference?: string }
  ) {
    this.appendTransaction(wallet, type, amount, 'CREDIT', metadata?.reference);
    wallet.balances[type] += amount;
  }

  private appendTransaction(
    wallet: Wallet,
    type: keyof WalletBalance,
    amount: number,
    direction: WalletTransaction['direction'],
    reference?: string
  ) {
    this.transactions.push({
      id: randomUUID(),
      walletId: wallet.id,
      type,
      amount,
      direction,
      occurredAt: dayjs().toISOString(),
      reference
    });
  }
}
