import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';
import { RedisService } from '../redis/redis.service';
import { SchedulerLockKeyEnum } from './constant/scheduler.enum';
import { SlackMessageService } from '../notification/slack/service/slackMessage.service';
import { SchedulerRepository } from './repository/scheduler.repository';
import { UserEntity } from 'src/entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  constructor(
    public readonly configService: ConfigService,
    private readonly schedulerRepository: SchedulerRepository,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly slackMessageService: SlackMessageService
  ) {}

  private readonly nodeEnv = this.configService.get('API_NODE_ENV');

  @Cron('0 9 * * 0', { timeZone: 'Asia/Seoul' })
  async sendLottoEmailToSubscriberListScheduler(): Promise<void> {
    const lockKey: SchedulerLockKeyEnum = SchedulerLockKeyEnum.EMAIL_SEND_LOCK;
    const lock: string = await this.redisService.setLock(lockKey);
    // lock 획득을 성공한 prod 환경에서만 실행
    if (lock && this.nodeEnv === 'prod') {
      await this.emailService.sendLottoEmailToSubscriberList();

      await this.redisService.unLock(lockKey);
    }
  }

  // @Cron('0 9 * * 1', { timeZone: 'Asia/Seoul' })
  @Cron('* * * * *', { timeZone: 'Asia/Seoul' })
  async sendSlackMessageToSubscriberListScheduler(): Promise<void> {
    const lockKey: SchedulerLockKeyEnum = SchedulerLockKeyEnum.SLACK_MESSAGE_SEND_LOCK;
    const lock: string = await this.redisService.setLock(lockKey);
    // lock 획득을 성공한 prod 환경에서만 실행
    if (lock && this.nodeEnv === 'prod') {
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
