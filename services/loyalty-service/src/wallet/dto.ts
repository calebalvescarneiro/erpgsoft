import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested
} from 'class-validator';
import { RewardType } from '../programs/program-catalog.js';

const REWARD_TYPES: RewardType[] = ['POINTS', 'CASHBACK', 'GIFT_CARD'];

export class CreateWalletDto {
  @IsString()
  tenantId!: string;

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  programId?: string;
}

export class WalletTransactionItemDto {
  @IsIn(REWARD_TYPES)
  type!: RewardType;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class RecordAccrualDto {
  @IsString()
  walletId!: string;

  @IsNumber()
  @IsPositive()
  purchaseValue!: number;

  @IsOptional()
  @IsString()
  programId?: string;
}

export class RedeemWalletDto {
  @IsString()
  walletId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WalletTransactionItemDto)
  items!: WalletTransactionItemDto[];
}

export class IssueGiftCardDto {
  @IsString()
  walletId!: string;

  @IsNumber()
  @IsPositive()
  value!: number;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class AdjustBalanceDto {
  @IsString()
  walletId!: string;

  @IsIn(REWARD_TYPES)
  type!: RewardType;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
