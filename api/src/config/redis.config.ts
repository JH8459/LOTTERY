import { RedisModuleAsyncOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const REDIS_CONFIG: RedisModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('API_REDIS_HOST'),
      port: configService.get<string>('API_REDIS_PORT'),
      db: 0,
      lazyConnect: true,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
      maxRetriesPerRequest: null,
      reconnectOnError: (err) => {
        err;
        return true;
      },
    },
    errorLog: false,
    readyLog: false,
  }),
};
