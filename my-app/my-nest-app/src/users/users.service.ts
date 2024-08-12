import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { PasswordService } from 'src/auth/services/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private passwordService: PasswordService,
  ) {}
  async create(data: CreateUserDto) {
    const encryptedPassword = await this.passwordService.hashPassword(
      data.password,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.prismaService.user.create({
      data: {
        ...data,
        password: encryptedPassword,
      },
    });
    return user;
  }
  async findbyName(name: string) {
    const user = await this.prismaService.user.findFirst({
      where: { name },
    });
    if (!user) {
      throw new NotFoundException(`User ${name} not found`);
    }
    return user;
  }
  async findAll() {
    return this.prismaService.user.findMany();
  }
}
