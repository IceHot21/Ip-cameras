import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //@TODO vinesti v guard
  async validateUser(username: string): Promise<any> {
    return await this.userRepository.findOne({ where: { name: username } });
  }

  async login(user: User, @Res({ passthrough: true }) response: Response) {
    const payload = { username: user.name, sub: user.id, role: user.role };
    const jwt = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    // Сохраняем рефреш токен в базе данных
    await this.userRepository.update(user.id, { refreshtoken: refreshToken });
    //токены можно возвращать не в заголовках а в теле ответа ну пох
    response.cookie('access_token', jwt, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, { httpOnly: true });
    return {
      message: 'Login successful',
    };
  }

  async register(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
  async refreshToken(refreshtoken: string) {
    try {
      const payload = this.jwtService.verify(refreshtoken);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, refreshtoken },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newPayload = { username: user.name, sub: user.id, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload);
      return {
        access_token: newAccessToken,
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
