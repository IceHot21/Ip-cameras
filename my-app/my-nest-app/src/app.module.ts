import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabase } from 'typeorm-extension';
import { User } from './user/user.entity.js';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(join(__dirname, 'migrations', '*.js'));
        const options = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'Dd7560848!'),
          database: configService.get('DB_DATABASE', 'ip_cameras_db'),
          entities: [User],
          migrations: [
            join(__dirname, 'migrations', '*.js'), // Используйте относительный путь
          ],
          synchronize: false,
          migrationsRun: true, // Автоматически запускать миграции
          cli: {
            migrationsDir: join(__dirname, 'migrations'), // Используйте относительный путь
          },
        };

        try {
          // Создаем базу данных, если она не существует
          await createDatabase({ options, ifNotExist: true });
        } catch (error) {
          console.error('Error creating database:', error);
          throw error;
        }

        return options;
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
