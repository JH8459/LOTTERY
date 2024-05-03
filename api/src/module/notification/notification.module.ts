import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { BoltService } from './slack/bolt.service';
import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.service';

@Module({
  imports: [EmailModule, SlackModule],
  providers: [EmailService, SlackService, BoltService],
  exports: [EmailService, SlackService, BoltService],
})
export class NotificationsModule {}
