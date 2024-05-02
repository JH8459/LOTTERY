import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import * as NestJSSlack from 'nestjs-slack';
import { SLACK_CONFIG } from 'src/config/slack.config';

@Module({
  imports: [NestJSSlack.SlackModule.forRootAsync(SLACK_CONFIG)],
  providers: [SlackService],
  controllers: [SlackController],
})
export class SlackModule {}
