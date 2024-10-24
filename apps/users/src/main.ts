import { NestFactory } from '@nestjs/core';
// import { UsersModule } from './users/users.module';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5172',
      'http://localhost:5173',
      'quick-dash.netlify.app',
      'quick-dash-restaurant.netlify.app/',
    ],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Access-Token',
      'Refresh-Token',
      'X-Refresh-Token ',
      'Authorization',
    ],
    exposedHeaders: [
      'Content-Type',
      'Access-Token',
      'Refresh-Token',
      'X-Refresh-Token ',
      'Authorization',
    ],
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/email-templates'));

  app.setViewEngine('ejs');

  await app.listen(4001);
}
bootstrap();
