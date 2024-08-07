import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log(request.cookies); // Add this line to log the cookies
          if (request?.cookies?.['access_token'])
            return request.cookies['access_token'];
          throw new BadRequestException('Invalid token');
        },
      ]),
      secretOrKey: 'Dd7560848!', // Замените на ваш секретный ключ
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
