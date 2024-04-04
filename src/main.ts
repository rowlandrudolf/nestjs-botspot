if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cs = app.get(ConfigService);
  app.enableCors({ origin: cs.get('CORS_ORIGN') });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(cs.get('PORT'));
}
bootstrap();
