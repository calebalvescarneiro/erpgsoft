import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  BatchWebhookDto,
  ListByCategoryQuery,
  RegisterIntegrationDto,
  SyncRequestDto,
  UpdateIntegrationDto
} from './dto.js';
import { IntegrationsService } from './integrations.service.js';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get('providers')
  listProviders(@Query() query: ListByCategoryQuery) {
    return this.integrations.listProviders(query);
  }

  @Post()
  register(@Body() payload: RegisterIntegrationDto) {
    return this.integrations.registerIntegration(payload);
  }

  @Patch(':tenantId/:providerId')
  update(
    @Param('tenantId') tenantId: string,
    @Param('providerId') providerId: string,
    @Body() payload: UpdateIntegrationDto
  ) {
    return this.integrations.updateIntegration(tenantId, providerId, payload);
  }

  @Get()
  list(@Query('tenantId') tenantId?: string) {
    return this.integrations.listIntegrations(tenantId);
  }

  @Post('sync')
  sync(@Body() payload: SyncRequestDto) {
    return this.integrations.triggerSync(payload);
  }

  @Post('webhook')
  webhook(@Body() payload: BatchWebhookDto) {
    return this.integrations.handleWebhookBatch(payload);
  }

  @Get('webhook')
  webhookEvents(
    @Query('tenantId') tenantId?: string,
    @Query('providerId') providerId?: string
  ) {
    if (!tenantId) {
      throw new BadRequestException('tenantId is required to list webhook events');
    }
    return this.integrations.listWebhookEvents(tenantId, providerId);
  }
}
