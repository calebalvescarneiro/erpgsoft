import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { findProvider, ProviderDescriptor, ProviderCategory, PROVIDERS } from '../providers/provider-registry.js';
import {
  BatchWebhookDto,
  ListByCategoryQuery,
  RegisterIntegrationDto,
  SyncRequestDto,
  UpdateIntegrationDto,
  WebhookEventDto
} from './dto.js';

export interface IntegrationConfig {
  id: string;
  tenantId: string;
  provider: ProviderDescriptor;
  credentials: Record<string, string>;
  events: string[];
  enabled: boolean;
  environment: 'sandbox' | 'production';
  createdAt: string;
  updatedAt: string;
  lastSyncAt?: string;
}

export interface IntegrationSyncResult {
  integrationId: string;
  providerId: string;
  scope: string;
  startedAt: string;
  finishedAt: string;
  status: 'SUCCESS' | 'SKIPPED';
  message?: string;
}

@Injectable()
export class IntegrationsService {
  private readonly registry = new Map<string, IntegrationConfig>();
  private readonly webhooks: WebhookEventDto[] = [];

  registerIntegration(payload: RegisterIntegrationDto) {
    const provider = findProvider(payload.providerId);
    const id = randomUUID();
    const integration: IntegrationConfig = {
      id,
      tenantId: payload.tenantId,
      provider,
      credentials: payload.credentials,
      events: payload.events ?? [],
      enabled: true,
      environment: payload.environment ?? 'sandbox',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString()
    };
    this.registry.set(this.buildKey(payload.tenantId, payload.providerId), integration);
    return integration;
  }

  updateIntegration(tenantId: string, providerId: string, payload: UpdateIntegrationDto) {
    const integration = this.getIntegration(tenantId, providerId);
    if (payload.enabled !== undefined) {
      integration.enabled = payload.enabled;
    }
    if (payload.credentials) {
      integration.credentials = payload.credentials;
    }
    if (payload.events) {
      integration.events = payload.events;
    }
    integration.updatedAt = dayjs().toISOString();
    return integration;
  }

  listIntegrations(tenantId?: string) {
    const list = Array.from(this.registry.values());
    if (!tenantId) {
      return list;
    }
    return list.filter((item) => item.tenantId === tenantId);
  }

  listProviders(query: ListByCategoryQuery) {
    if (!query.category) {
      return PROVIDERS;
    }
    return PROVIDERS.filter((provider) => provider.category === query.category);
  }

  triggerSync(payload: SyncRequestDto): IntegrationSyncResult {
    const integration = this.getIntegration(payload.tenantId, payload.providerId);
    if (!integration.enabled) {
      return {
        integrationId: integration.id,
        providerId: integration.provider.id,
        scope: payload.scope ?? 'full',
        startedAt: dayjs().toISOString(),
        finishedAt: dayjs().toISOString(),
        status: 'SKIPPED',
        message: 'Integration disabled'
      };
    }
    const startedAt = dayjs();
    integration.lastSyncAt = startedAt.toISOString();
    return {
      integrationId: integration.id,
      providerId: integration.provider.id,
      scope: payload.scope ?? 'full',
      startedAt: startedAt.toISOString(),
      finishedAt: dayjs().toISOString(),
      status: 'SUCCESS'
    };
  }

  handleWebhookBatch(payload: BatchWebhookDto) {
    const provider = findProvider(payload.providerId);
    payload.events.forEach((event) => {
      this.webhooks.push({
        ...event,
        payload: { ...event.payload, provider: provider.id, receivedAt: dayjs().toISOString() }
      });
    });
    return { received: payload.events.length, provider };
  }

  listWebhookEvents(providerId?: string) {
    if (!providerId) {
      return this.webhooks;
    }
    return this.webhooks.filter((event) => event.payload.provider === providerId);
  }

  private buildKey(tenantId: string, providerId: string) {
    return `${tenantId}:${providerId}`;
  }

  private getIntegration(tenantId: string, providerId: string) {
    const integration = this.registry.get(this.buildKey(tenantId, providerId));
    if (!integration) {
      throw new Error(`Integration for provider ${providerId} not found`);
    }
    return integration;
  }
}
