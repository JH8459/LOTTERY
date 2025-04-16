import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'emailQueue' }), SlackModule],
  providers: [EmailService, EmailProcessor],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
