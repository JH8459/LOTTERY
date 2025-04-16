import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { emailTemplate } from './template/email.template';
import { convertDateFormat } from 'src/common/utils/utils';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from '../../../common/interface/lotto.interface';
import { PublicSubscriberInfoInterface } from './interface/subscriber.interface';
import { InternalServerError } from './error/500.error';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RedisService } from 'src/module/redis/redis.service';
import { CustomInternalServerErrorException } from 'src/common/custom/exception/exception.service';

@Injectable()
export class EmailService {
  private readonly API_EMAIL_FROM: string;
  private readonly GITHUB_TOKEN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    @InjectQueue('emailQueue') private readonly emailQueue: Queue
  ) {
    this.API_EMAIL_FROM = this.configService.get<string>('API_EMAIL_FROM');
    this.GITHUB_TOKEN = this.configService.get<string>('COMMON_GITHUB_TOKEN');
  }

  /**
   *
   * @param emailInfo
   * @description 이메일 전송을 위한 작업을 큐에 추가합니다.
   * @returns void
   */
  async enqueueLottoEmail(emailInfo: string): Promise<void> {
    // 로또 회차 정보, 통계 정보, 당첨금 정보를 Redis에서 가져옵니다.
    const lottoInfo: LottoInfoInterface = await this.redisService.getRecentlyLottoInfo();
    const lottoStatisticInfo: LottoStatisticInfoInterface = await this.redisService.getRecentlyLottoStatisticInfo();
    const lottoHighestPrizeInfo: LottoHighestPrizeInfoInterface =
      await this.redisService.getRecentlyLottoHighestPrizeInfo();

    // 이메일 전송 작업을 위한 옵션을 설정합니다.
    const mailOptions: ISendMailOptions = {
      to: emailInfo,
      from: this.API_EMAIL_FROM,
      subject: `[LOTTERY🍀] ${lottoInfo.drwNo}회 당첨결과 (${convertDateFormat(lottoInfo.drwNoDate)})`,
      html: emailTemplate(lottoInfo, lottoStatisticInfo, lottoHighestPrizeInfo),
    };

    // 큐에 작업을 추가합니다.
    await this.emailQueue.add('sendEmail', mailOptions, {
      attempts: 3, // 최대 3회 재시도
      backoff: 10000, // 10초 간격으로 재시도
      removeOnComplete: true,
      removeOnFail: false, // 실패한 작업은 남겨서 확인 가능
    });
  }

  /**
   *
   * @description GitHub의 구독자 목록을 가져와서 이메일 전송 작업을 큐에 추가합니다.
   * @returns void
   */
  async enqueueLottoEmailToSubscriberList(): Promise<void> {
    try {
      const axiosReqConfig: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${this.GITHUB_TOKEN}`,
        },
      };

      const subscriberList: AxiosResponse = await axios.get(
        'https://api.github.com/repos/jh8459/LOTTERY/subscribers',
        axiosReqConfig
      );

      await Promise.all(
        subscriberList.data.map(async (subscriber: PublicSubscriberInfoInterface): Promise<void> => {
          const subscriberInfo: AxiosResponse = await axios.get(subscriber.url, axiosReqConfig);

          if (subscriberInfo.data.email !== null && subscriberInfo.data.email !== '') {
            await this.enqueueLottoEmail(subscriberInfo.data.email);
          }
        })
      );
    } catch (err) {
      throw new CustomInternalServerErrorException(InternalServerError.GITHUB.message);
    }
  }

  /**
   *
   * @param mailOptions
   * @description 이메일 전송을 실행합니다.
   * @throws CustomInternalServerErrorException
   * @returns void
   */
  async sendLottoEmail(mailOptions: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (err) {
      throw new CustomInternalServerErrorException('메일 전송에 실패했습니다.');
    }
  }
}
