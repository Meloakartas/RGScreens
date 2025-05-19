import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust the first proxy (e.g., nginx) in production for correct X-Forwarded-For/IP
  if (process.env.NODE_ENV === 'production') {
    const expressApp = app.getHttpAdapter().getInstance() as Express;
    expressApp.set('trust proxy', 1);
  }

  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://rgscreens.app'
      : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
