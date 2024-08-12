import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }
  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return compare(password, storedPasswordHash);
  }
}
