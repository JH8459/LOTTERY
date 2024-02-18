import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { emailTemplate } from './template/email.template';
import { convertDateFormat } from 'src/common/utils/utils';
import { LottoInfoInterface, LottoStatisticInfoInterface } from './interface/mailInfo.interface';
import { PublicSubscriberInfoInterface } from './interface/subscriber.interface';

@Injectable()
export class EmailService {
  constructor(
    public readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async sendLottoEmail(emailInfo: string): Promise<void> {
    const from: string = this.configService.get<string>('API_EMAIL_FROM');

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

    try {
      await this.mailerService.sendMail({
        to: emailInfo,
        from,
        subject: `[LOTTERY🍀] ${lottoInfo.drwNo}회 당첨결과 (${convertDateFormat(lottoInfo.drwNoDate)})`,
        html: emailTemplate(lottoInfo, lottoStatisticInfo),
      });
    } catch (err) {
      throw new BadRequestException('메일 전송에 실패했습니다.');
    }
  }

  async sendLottoEmailToSubscriberList(): Promise<void> {
    try {
      const GITHUB_TOKEN: string = this.configService.get<string>('COMMON_GITHUB_TOKEN');

      const axiosReqConfig: AxiosRequestConfig = {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      };

      const subscriberList: AxiosResponse = await axios.get(
        'https://api.github.com/repos/jh8459/LOTTERY/subscribers',
        axiosReqConfig
      );

      await Promise.all(
        subscriberList.data.map(async (subscriber: PublicSubscriberInfoInterface) => {
          const subscriberInfo: AxiosResponse = await axios.get(subscriber.url, axiosReqConfig);

          const emailInfo: string = subscriberInfo.data.email;

          await this.sendLottoEmail(emailInfo);
        })
      );
    } catch {
      throw new BadRequestException('구독자 목록을 불러오는데 실패했습니다.');
    }
  }
}
