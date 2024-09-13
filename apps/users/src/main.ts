import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);

  app.enableCors({
    origin: ['http://localhost:5172', 'http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Refresh-Token', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Refresh-Token', 'Authorization'],
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/email-templates'));

  app.setViewEngine('ejs');

  await app.listen(4001);
}
bootstrap();
