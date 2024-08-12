import { Roles } from '@prisma/client';

export class CreateUserDto {
  name!: string; // Убедитесь, что поле name обязательно
  password!: string;
  roles!: Roles[];
}
