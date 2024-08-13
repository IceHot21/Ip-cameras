import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import * as dotenv from 'dotenv';
import { IpController } from './ip-cameras/ip.controller.js';
import { IpService } from './ip-cameras/ip.service.js';
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

console.log('process.env.JWT_SECRET - app.module', process.env.JWT_SECRET);

@Module({
  imports: [],
  controllers: [AppController, IpController],
  providers: [AppService, IpService],
})
export class AppModule {}
