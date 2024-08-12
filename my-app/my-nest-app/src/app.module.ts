import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

console.log('process.env.JWT_SECRET - app.module', process.env.JWT_SECRET);

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
