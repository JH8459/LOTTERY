import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { FeedbackEntity } from 'src/entity/feedback.entity';
import { LottoEntity } from 'src/entity/lotto.entity';
import { QnaEntity } from 'src/entity/qna.entity';
import { SpeettoEntity } from 'src/entity/speetto.entity';
import { UserEntity } from 'src/entity/user.entity';
import { WorkspaceEntity } from 'src/entity/workspace.entity';

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
    entities: [LottoEntity, SpeettoEntity, WorkspaceEntity, UserEntity, FeedbackEntity, QnaEntity],
    synchronize: false,
    logging: configService.get<string>('API_NODE_ENV') === 'dev',
  }),
};
