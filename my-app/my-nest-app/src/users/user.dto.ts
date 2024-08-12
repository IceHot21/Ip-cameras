import { Roles } from '@prisma/client';

export class UserDto {
  id: string | undefined;
  name: string | undefined;
  password: string | undefined;
  roles: Roles[] | undefined;
}
