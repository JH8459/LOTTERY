import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';

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
    // entities: ['dist/**/*.entity.js'],
    entities: [LottoEntity],
    synchronize: false,
    logging: configService.get<string>('API_NODE_ENV') === 'dev',
  }),
};
