import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [EmailModule, SlackModule],
  exports: [EmailModule, SlackModule],
})
export class NotificationsModule {}
