import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CalculateTaxDto, RegisterDocumentDto, SyncContingencyDto } from './dto.js';
import { FiscalService } from './fiscal.service.js';

@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscal: FiscalService) {}

  @Post('calculate')
  calculate(@Body() payload: CalculateTaxDto) {
    return this.fiscal.calculateTaxes(payload);
  }

  @Post('documents')
  register(@Body() payload: RegisterDocumentDto) {
    return this.fiscal.registerDocument(payload);
  }

  @Get('documents')
  list(@Query('tenantId') tenantId?: string) {
    return this.fiscal.listDocuments(tenantId);
  }

  @Post('contingency/sync')
  sync(@Body() payload: SyncContingencyDto) {
    return this.fiscal.syncContingency(payload);
  }

  @Get('documents/:id')
  find(@Param('id') id: string) {
    return this.fiscal.listDocuments().find((doc) => doc.id === id);
  }
}
