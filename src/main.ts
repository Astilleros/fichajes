import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.enableCors({
    origin: ['*', 'ficfac.app', 'www.ficfac.app', 'http://localhost:4200'],
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
/*       transform: false,
      validationError: {
        target: true,
        value: true,
      }, */
    })
  );
  await app.listen(3000);
}
bootstrap();
