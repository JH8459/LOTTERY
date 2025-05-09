import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';
import { SchedulerLockKeyEnum } from './constant/scheduler.enum';
import { SlackMessageService } from '../notification/slack/util/slackMessage.service';
import { SchedulerRepository } from './repository/scheduler.repository';
import { ConfigService } from '@nestjs/config';
import { SUBSCRIBE_TYPE } from 'src/common/constant/enum';
import { SubscribeUserInfoDto } from './dto/user.dto';
import { RedisLockService } from '../redis/util/redisLock.service';

@Injectable()
export class SchedulerService {
  private readonly API_NODE_ENV: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisLockService: RedisLockService,
    private readonly schedulerRepository: SchedulerRepository,
    private readonly emailService: EmailService,
    private readonly slackMessageService: SlackMessageService
  ) {
    this.API_NODE_ENV = this.configService.get<string>('API_NODE_ENV');
  }

  @Cron('0 9 * * 0', { timeZone: 'Asia/Seoul' })
  async sendLottoEmailToSubscriberListScheduler(): Promise<void> {
    const lockKey: SchedulerLockKeyEnum = SchedulerLockKeyEnum.EMAIL_SEND_LOCK;
    const lock: boolean = await this.redisLockService.setLock(lockKey);

    // lock 획득을 성공한 prod 환경에서만 실행
    if (lock && this.API_NODE_ENV === 'prod') {
      const userInfoList: SubscribeUserInfoDto[] = await this.schedulerRepository.getSubscribeUsers(
        SUBSCRIBE_TYPE.EMAIL
      );

      if (userInfoList.length) {
        await Promise.all(
          userInfoList.map(
            async (userInfo: SubscribeUserInfoDto) => await this.emailService.enqueueLottoEmail(userInfo.userEmail)
          )
        );
      }

      await this.redisLockService.unLock(lockKey);
    }
  }

  @Cron('0 9 * * 1', { timeZone: 'Asia/Seoul' })
  async sendSlackMessageToSubscriberListScheduler(): Promise<void> {
    const lockKey: SchedulerLockKeyEnum = SchedulerLockKeyEnum.SLACK_MESSAGE_SEND_LOCK;
    const lock: boolean = await this.redisLockService.setLock(lockKey);

    // lock 획득을 성공한 prod 환경에서만 실행
    if (lock && this.API_NODE_ENV === 'prod') {
      const userInfoList: SubscribeUserInfoDto[] = await this.schedulerRepository.getSubscribeUsers(
        SUBSCRIBE_TYPE.SLACK
      );

      if (userInfoList.length) {
        await Promise.all(
          userInfoList.map(
            async (useInfo: SubscribeUserInfoDto) =>
              await this.slackMessageService.sendSlackMessageToSubscriberList(useInfo.userIdx)
          )
        );
      }

      await this.redisLockService.unLock(lockKey);
    }
  }
}
