import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';
import { RedisService } from '../redis/redis.service';
import { SchedulerLockKeyEnum } from './constant/scheduler.enum';
import { SlackMessageService } from '../notification/slack/service/slackMessage.service';
import { SchedulerRepository } from './repository/scheduler.repository';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly slackMessageService: SlackMessageService
  ) {}

  @Cron('0 9 * * 0', { timeZone: 'Asia/Seoul' })
  async sendLottoEmailToSubscriberListScheduler(): Promise<void> {
    const lockKey: SchedulerLockKeyEnum = SchedulerLockKeyEnum.EMAIL_SEND_LOCK;
    const lock: string = await this.redisService.setLock(lockKey);

    if (lock) {
      await this.emailService.sendLottoEmailToSubscriberList();

      await this.redisService.unLock(lockKey);
    }
  }

  @Cron('* * * * *', { timeZone: 'Asia/Seoul' })
  async sendSlackMessageToSubscriberListScheduler(): Promise<void> {
    const lockKey: SchedulerLockKeyEnum = SchedulerLockKeyEnum.SLACK_MESSAGE_SEND_LOCK;
    const lock: string = await this.redisService.setLock(lockKey);

    if (lock) {
      const userList: UserEntity[] = await this.schedulerRepository.getSubscribeUsers();

      if (userList.length) {
        await Promise.all(
          userList.map(
            async (user: UserEntity) => await this.slackMessageService.sendSlackMessageToSubscriberList(user.userIdx)
          )
        );
      }

      await this.redisService.unLock(lockKey);
    }
  }
}
