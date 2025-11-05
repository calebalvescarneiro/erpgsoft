import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import {
  resolveRule,
  BusinessSegment,
  FiscalDocumentType,
  TaxRegimeCode
} from '../regimes/regime-catalog.js';
import { CalculateTaxDto, RegisterDocumentDto, SaleItemDto, SyncContingencyDto } from './dto.js';

export interface FiscalBreakdownItem {
  sku: string;
  description: string;
  quantity: number;
  taxableAmount: number;
  taxes: {
    icms?: number;
    iss?: number;
    pis?: number;
    cofins?: number;
  };
}

export interface FiscalDocumentRecord {
  id: string;
  tenantId: string;
  documentNumber: string;
  document: FiscalDocumentType;
  regime: TaxRegimeCode;
  segment: BusinessSegment;
  grossTotal: number;
  taxTotal: number;
  items: FiscalBreakdownItem[];
  createdAt: string;
  submissionMode: 'online' | 'contingency';
  syncedAt?: string;
}

@Injectable()
export class FiscalService {
  private readonly documents = new Map<string, FiscalDocumentRecord>();

  calculateTaxes(payload: CalculateTaxDto) {
    const rule = resolveRule(payload.regime, payload.segment, payload.document);
    const items = payload.items.map((item) => this.buildBreakdown(item, rule.rates));
    const grossTotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totals = this.summarize(items);
    return {
      regime: payload.regime,
      segment: payload.segment,
      document: payload.document,
      rule,
      grossTotal,
      taxes: totals,
      contingency: payload.contingency ?? false,
      recommendedSubmissionMode:
        payload.contingency || !rule.contingencyAllowed ? 'online' : 'contingency'
    } as const;
  }

  registerDocument(payload: RegisterDocumentDto) {
    const record: FiscalDocumentRecord = {
      id: randomUUID(),
      tenantId: payload.tenantId,
      documentNumber: payload.documentNumber,
      document: payload.document,
      regime: payload.regime,
      segment: payload.segment,
      grossTotal: payload.grossTotal,
      taxTotal: payload.taxTotal,
      items: payload.items.map((item) =>
        this.buildBreakdown(item, resolveRule(payload.regime, payload.segment, payload.document).rates)
      ),
      createdAt: dayjs().toISOString(),
      submissionMode: payload.submissionMode ?? 'online'
    };
    this.documents.set(record.id, record);
    return record;
  }

  listDocuments(tenantId?: string) {
    const records = Array.from(this.documents.values());
    if (!tenantId) {
      return records;
    }
    return records.filter((record) => record.tenantId === tenantId);
  }

  syncContingency(payload: SyncContingencyDto) {
    const synced: FiscalDocumentRecord[] = [];
    payload.documentNumbers.forEach((doc) => {
      const record = Array.from(this.documents.values()).find(
        (entry) => entry.tenantId === payload.tenantId && entry.documentNumber === doc
      );
      if (record && record.submissionMode === 'contingency') {
        record.syncedAt = dayjs().toISOString();
        record.submissionMode = 'online';
        synced.push(record);
      }
    });
    return synced;
  }

  private buildBreakdown(item: SaleItemDto, rates: FiscalBreakdownItem['taxes']): FiscalBreakdownItem {
    const taxableAmount = item.unitPrice * item.quantity - (item.discount ?? 0);
    const taxes = Object.entries(rates).reduce<FiscalBreakdownItem['taxes']>((acc, [key, rate]) => {
      if (typeof rate === 'number') {
        acc[key as keyof FiscalBreakdownItem['taxes']] = Number((taxableAmount * rate).toFixed(2));
      }
      return acc;
    }, {});
    return {
      sku: item.sku,
      description: item.description,
      quantity: item.quantity,
      taxableAmount: Number(taxableAmount.toFixed(2)),
      taxes
    };
  }

  private summarize(items: FiscalBreakdownItem[]) {
    return items.reduce(
      (acc, item) => {
        Object.entries(item.taxes).forEach(([key, value]) => {
          if (!acc[key as keyof typeof acc]) {
            acc[key as keyof typeof acc] = 0;
          }
          acc[key as keyof typeof acc]! += value ?? 0;
        });
        acc.total += Object.values(item.taxes).reduce((sum, value) => sum + (value ?? 0), 0);
        return acc;
      },
      { total: 0, icms: 0, iss: 0, pis: 0, cofins: 0 }
    );
  }
}
