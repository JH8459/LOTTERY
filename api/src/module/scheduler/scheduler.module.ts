import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { SchedulerRepository } from './repository/scheduler.repository';
import { RedisModule } from '../redis/redis.module';
import { NotificationsModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ScheduleModule.forRoot(), NotificationsModule],
  providers: [SchedulerService, SchedulerRepository],
})
export class SchedulerModule {}
