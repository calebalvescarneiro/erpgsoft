import { Module } from '@nestjs/common';
import { FiscalModule } from '../fiscal/fiscal.module.js';

@Module({
  imports: [FiscalModule]
})
export class AppModule {}
