import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Post('login')
  async login(@Body() user: User) {
    const validatedUser = await this.authService.validateUser(user.name);
    if (
      validatedUser &&
      (await bcrypt.compare(user.password, validatedUser.password))
    ) {
      return this.authService.login(validatedUser);
    }
    return { message: 'Invalid credentials' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
