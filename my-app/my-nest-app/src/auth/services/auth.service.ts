import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from '../context/types';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}
  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findbyName(name);
    const isPassword = await this.passwordService.comparePasswords(
      pass,
      user.password,
    );
    if (user && isPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    console.log('user', user);
    const payload: IPayload = {
      sub: user.id,
      name: user.name,
      roles: user.roles,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
