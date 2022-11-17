import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['*', 'ficfac.app', 'www.ficfac.app'] });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
