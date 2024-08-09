import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('register')
  // @Roles('admin')
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Post('login')
  async login(
    @Body() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const validatedUser = await this.authService.validateUser(user.name);
    if (
      validatedUser &&
      (await bcrypt.compare(user.password, validatedUser.password))
    ) {
      return this.authService.login(validatedUser, response);
    }
    return { message: 'Invalid credentials' };
  }
  @Post('pisya')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async pisya(@Req() req: any) {
    return req.user;
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user);
  }
}
