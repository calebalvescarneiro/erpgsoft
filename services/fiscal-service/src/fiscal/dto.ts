import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from 'class-validator';
import { BusinessSegment, FiscalDocumentType, TaxRegimeCode } from '../regimes/regime-catalog.js';

export class SaleItemDto {
  @IsString()
  sku!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class CalculateTaxDto {
  @IsEnum(TaxRegimeCode)
  regime!: TaxRegimeCode;

  @IsEnum(FiscalDocumentType)
  document!: FiscalDocumentType;

  @IsEnum(BusinessSegment)
  segment!: BusinessSegment;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items!: SaleItemDto[];

  @IsOptional()
  @IsBoolean()
  contingency?: boolean;

  @IsOptional()
  @IsString()
  destinationUf?: string;
}

export class RegisterDocumentDto {
  @IsString()
  tenantId!: string;

  @IsString()
  documentNumber!: string;

  @IsEnum(FiscalDocumentType)
  document!: FiscalDocumentType;

  @IsEnum(TaxRegimeCode)
  regime!: TaxRegimeCode;

  @IsEnum(BusinessSegment)
  segment!: BusinessSegment;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items!: SaleItemDto[];

  @IsNumber()
  @Min(0)
  grossTotal!: number;

  @IsNumber()
  @Min(0)
  taxTotal!: number;

  @IsOptional()
  @IsIn(['online', 'contingency'])
  submissionMode?: 'online' | 'contingency';
}

export class SyncContingencyDto {
  @IsString()
  tenantId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  documentNumbers!: string[];
}
