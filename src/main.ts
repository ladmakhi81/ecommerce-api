import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get('APP_PORT'));

  app.enableCors();

  await app.listen(port, () => {
    console.log(`the server is running: ${app.getUrl()}`);
  });
};

export default bootstrap();
