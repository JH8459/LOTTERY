import { ConfigModule, ConfigService } from '@nestjs/config';
import { SlackAsyncConfig, SlackConfig } from 'nestjs-slack/dist/types';

export const SLACK_CONFIG: SlackAsyncConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<SlackConfig> => ({
    type: 'api',
    token: configService.get<string>('API_SLACK_SIGNING_SECRET'),
  }),
};
