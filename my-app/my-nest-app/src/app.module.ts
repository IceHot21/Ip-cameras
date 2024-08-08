import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabase } from 'typeorm-extension';
import { User } from './user/user.entity.js';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'Dd7560848!'),
          database: configService.get('DB_DATABASE', 'ip_cameras_db'),
          entities: [User],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: false,
        };

        // Создаем базу данных, если она не существует
        await createDatabase({ options });

        return options;
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}

  async onModuleInit() {
    await this.connection.runMigrations();
  }
}
