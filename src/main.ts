import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get('APP_PORT'));

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, transform: true }),
  );
  app.setGlobalPrefix('/api');

  await app.listen(port, async () => {
    const appURL = await app.getUrl();
    console.log(`the server is running: ${appURL}`);
  });
};

export default bootstrap();
