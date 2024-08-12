import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
} else {
  console.log('process.env.JWT_SECRET - main.ts', process.env.JWT_SECRET);
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:7776',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept',
      credentials: true, // Разрешить отправку куки
    });
    await app.listen(4200);
  }
  bootstrap();
}
