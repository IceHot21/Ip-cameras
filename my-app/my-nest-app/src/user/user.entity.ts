import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id!: number;
  @Column({ unique: true })
  name!: string;
  @Column()
  password!: string;
  @Column()
  role!: string; // Добавляем поле роли
}
