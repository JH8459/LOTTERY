import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.service';
import { PrizeInfoService } from './slack/util/commands/prizeInfo.service';
import { SlackRepository } from './slack/repository/slack.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity]), EmailModule, SlackModule],
  providers: [EmailService, SlackService, SlackRepository, PrizeInfoService],
  exports: [EmailService],
})
export class NotificationsModule {}
