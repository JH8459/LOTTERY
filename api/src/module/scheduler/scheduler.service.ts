import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';
import { RedisService } from '../redis/redis.service';
import { SchedulerLockKeyEnum } from './constant/scheduler.enum';

@Injectable()
export class SchedulerService {
  constructor(private readonly redisService: RedisService, private readonly emailService: EmailService) {}

  @Cron('0 9 * * 0', { timeZone: 'Asia/Seoul' })
  async sendLottoEmailToSubscriberListScheduler(): Promise<void> {
    const lockKey = SchedulerLockKeyEnum.EMAIL_SEND_LOCK;
    const lock = await this.redisService.setLock(lockKey);

    if (lock) {
      await this.emailService.sendLottoEmailToSubscriberList();

      await this.redisService.unLock(lockKey);
    }
  }
}
