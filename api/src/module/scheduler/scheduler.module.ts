import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';
import { SchedulerService } from './scheduler.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [ScheduleModule.forRoot(), RedisModule],
  providers: [SchedulerService, EmailService, RedisService],
})
export class SchedulerModule {}
