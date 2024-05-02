import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.service';
import * as NestJSSlack from 'nestjs-slack';
import { SLACK_CONFIG } from 'src/config/slack.config';

@Module({
  imports: [NestJSSlack.SlackModule.forRootAsync(SLACK_CONFIG), EmailModule, SlackModule],
  providers: [EmailService, SlackService],
  exports: [EmailService, SlackService],
})
export class NotificationsModule {}
