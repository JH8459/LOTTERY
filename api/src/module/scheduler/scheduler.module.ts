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

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ScheduleModule.forRoot(), RedisModule],
  providers: [SchedulerService, SchedulerRepository, RedisService, EmailService, SlackMessageService],
})
export class SchedulerModule {}
