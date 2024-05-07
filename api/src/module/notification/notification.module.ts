import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.service';
import { SlackRepository } from './slack/repository/slack.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';
import { BuilderService } from './slack/util/builder/builder.service';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity]), EmailModule, SlackModule],
  providers: [EmailService, SlackService, SlackRepository, BuilderService],
  exports: [EmailService],
})
export class NotificationsModule {}
