import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard.js';
import { AuthService } from './auth/services/auth.service.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';

@Controller('api')
export class AppController {
  // constructor(private readonly authService: AuthService) {}
  // @UseGuards(JwtAuthGuard)
  // @Get('/protected')
  // getHello(@Request() req: any) {
  //   return {
  //     message: `This route is protected, but the user is ${req.user.name} has access`,
  //     user: req.user,
  //   };
  // }
  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // login(@Request() req: any) {
  //   return this.authService.login(req.user);
  // }
}
