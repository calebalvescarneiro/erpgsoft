import { Controller, Get } from '@nestjs/common';
import { TenantsService } from './tenants.service.js';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get()
  list() {
    return this.tenants.list();
  }
}
