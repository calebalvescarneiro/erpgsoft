import { Module } from '@nestjs/common';
import { IntegrationsModule } from '../integrations/integrations.module.js';

@Module({
  imports: [IntegrationsModule]
})
export class AppModule {}
