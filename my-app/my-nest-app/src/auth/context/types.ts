import { Roles } from '@prisma/client';

export interface IPayload {
  sub: string;
  name: string;
  roles: Roles[];
}
