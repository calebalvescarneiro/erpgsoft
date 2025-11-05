import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  await app.listen(process.env.PORT ?? 3002);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Billing service failed to start', error);
  process.exit(1);
});
