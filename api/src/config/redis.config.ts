import { RedisModuleAsyncOptions, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { BullModuleAsyncOptions, BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const REDIS_CONFIG: RedisModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => ({
    type: 'single',
    url: `${configService.get<string>('API_REDIS_HOST')}:${configService.get<string>('API_REDIS_PORT')}`,
  }),
};

export const BULL_CONFIG: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => ({
    redis: {
      host: configService.get<string>('API_REDIS_HOST'),
      port: configService.get<number>('API_REDIS_PORT'),
    },
  }),
};
