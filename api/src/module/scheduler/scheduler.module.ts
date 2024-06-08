import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@nestjs-modules/ioredis';
import { EmailService } from '../notification/email/email.service';
import { SlackMessageService } from '../notification/slack/service/slackMessage.service';
import { SchedulerService } from './scheduler.service';
import { RedisService } from '../redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { SchedulerRepository } from './repository/scheduler.repository';
import { SlackRepository } from '../notification/slack/repository/slack.repository';
import { BuilderService } from '../notification/slack/service/builder.service';
import { FeedbackEntity } from 'src/entity/feedback.entity';
import { LottoEntity } from 'src/entity/lotto.entity';
import { WorkspaceEntity } from 'src/entity/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LottoEntity, WorkspaceEntity, UserEntity, FeedbackEntity]),
    ScheduleModule.forRoot(),
    RedisModule,
  ],
  providers: [
    SchedulerService,
    SchedulerRepository,
    RedisService,
    EmailService,
    SlackMessageService,
    BuilderService,
    SlackRepository,
  ],
})
export class SchedulerModule {}
