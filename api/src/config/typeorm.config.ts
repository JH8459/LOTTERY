import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const TYPE_ORM_CONFIG: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mariadb',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    charset: 'utf8mb4',
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    logging: configService.get<string>('API_NODE_ENV') === 'dev',
  }),
};

export const TYPE_ORM_TEST_CONFIG: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mariadb',
    host: 'lottery_test_db',
    port: 3306,
    username: 'root',
    password: 'testpassword',
    database: 'testdb',
    charset: 'utf8mb4',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    logging: false,
  }),
};
