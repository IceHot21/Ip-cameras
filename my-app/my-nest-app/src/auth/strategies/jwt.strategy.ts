import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayload } from '../context/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('process.env.JWT_SECRET - jwtstrategy', process.env.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreElements: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: IPayload) {
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
