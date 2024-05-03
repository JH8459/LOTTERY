import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { BoltService } from './bolt.service';

@Module({
  providers: [SlackService, BoltService],
  controllers: [SlackController],
})
export class SlackModule {}
