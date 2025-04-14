import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { emailTemplate } from './template/email.template';
import { convertDateFormat } from 'src/common/utils/utils';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from '../interface/lotto.interface';
import { PublicSubscriberInfoInterface } from './interface/subscriber.interface';
import { InternalServerError } from './error/500.error';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  private readonly API_EMAIL_FROM: string;
  private readonly GITHUB_TOKEN: string;

  constructor(
    public readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis,
    @InjectQueue('emailQueue') private readonly emailQueue: Queue
  ) {
    this.API_EMAIL_FROM = this.configService.get<string>('API_EMAIL_FROM');
    this.GITHUB_TOKEN = this.configService.get<string>('COMMON_GITHUB_TOKEN');
  }

  async enqueueLottoEmail(emailInfo: string): Promise<void> {
    const lottoInfo: LottoInfoInterface = {
      drwNo: Number(await this.redis.get('drwNo')),
      drwtNo1: Number(await this.redis.get('drwtNo1')),
      drwtNo2: Number(await this.redis.get('drwtNo2')),
      drwtNo3: Number(await this.redis.get('drwtNo3')),
      drwtNo4: Number(await this.redis.get('drwtNo4')),
      drwtNo5: Number(await this.redis.get('drwtNo5')),
      drwtNo6: Number(await this.redis.get('drwtNo6')),
      bnusNo: Number(await this.redis.get('bnusNo')),
      firstWinamnt: Number(await this.redis.get('firstWinamnt')),
      firstPrzwnerCo: Number(await this.redis.get('firstPrzwnerCo')),
      secondWinamnt: Number(await this.redis.get('secondWinamnt')),
      secondPrzwnerCo: Number(await this.redis.get('secondPrzwnerCo')),
      thirdWinamnt: Number(await this.redis.get('thirdWinamnt')),
      thirdPrzwnerCo: Number(await this.redis.get('thirdPrzwnerCo')),
      drwNoDate: new Date(await this.redis.get('drwNoDate')),
    };

    const lottoStatisticInfo: LottoStatisticInfoInterface = {
      firstLottoNo: Number(await this.redis.get('firstLottoNo')),
      firstLottoNoCnt: Number(await this.redis.get('firstLottoNoCnt')),
      secondLottoNo: Number(await this.redis.get('secondLottoNo')),
      secondLottoNoCnt: Number(await this.redis.get('secondLottoNoCnt')),
      thirdLottoNo: Number(await this.redis.get('thirdLottoNo')),
      thirdLottoNoCnt: Number(await this.redis.get('thirdLottoNoCnt')),
    };

    const lottoHighestPrizeInfo: LottoHighestPrizeInfoInterface = {
      thisYearDrwNo: Number(await this.redis.get('thisYearDrwNo')),
      thisYearFirstWinamnt: Number(await this.redis.get('thisYearFirstWinamnt')),
      thisYearFirstPrzwnerCo: Number(await this.redis.get('thisYearFirstPrzwnerCo')),
      thisYearDrwNoDate: new Date(await this.redis.get('thisYearDrwNoDate')),
      lastYearDrwNo: Number(await this.redis.get('lastYearDrwNo')),
      lastYearFirstWinamnt: Number(await this.redis.get('lastYearFirstWinamnt')),
      lastYearFirstPrzwnerCo: Number(await this.redis.get('lastYearFirstPrzwnerCo')),
      lastYearDrwNoDate: new Date(await this.redis.get('lastYearDrwNoDate')),
    };

    const mailOptions: ISendMailOptions = {
      to: emailInfo,
      from: this.API_EMAIL_FROM,
      subject: `[LOTTERY🍀] ${lottoInfo.drwNo}회 당첨결과 (${convertDateFormat(lottoInfo.drwNoDate)})`,
      html: emailTemplate(lottoInfo, lottoStatisticInfo, lottoHighestPrizeInfo),
    };

    await this.emailQueue.add('sendEmail', mailOptions);
  }

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
      throw new InternalServerErrorException(InternalServerError.GITHUB.message);
    }
  }

  async sendLottoEmail(mailOptions: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (err) {
      throw new InternalServerErrorException('메일 전송에 실패했습니다.');
    }
  }
}
