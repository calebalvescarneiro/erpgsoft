import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { ProviderCategory } from '../providers/provider-registry.js';

export class RegisterIntegrationDto {
  @IsString()
  tenantId!: string;

  @IsString()
  providerId!: string;

  @IsOptional()
  @IsString()
  environment?: 'sandbox' | 'production';

  @IsObject()
  credentials!: Record<string, string>;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  events?: string[];
}

export class UpdateIntegrationDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, string>;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  events?: string[];
}

export class SyncRequestDto {
  @IsString()
  tenantId!: string;

  @IsString()
  providerId!: string;

  @IsOptional()
  @IsEnum(['menu', 'orders', 'status'])
  scope?: 'menu' | 'orders' | 'status';
}

export class ListByCategoryQuery {
  @IsOptional()
  @IsEnum(['DELIVERY', 'MESSAGING', 'ECOMMERCE', 'PAYMENTS'])
  category?: ProviderCategory;
}

export class BatchWebhookDto {
  @IsString()
  providerId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WebhookEventDto)
  events!: WebhookEventDto[];
}

export class WebhookEventDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}
