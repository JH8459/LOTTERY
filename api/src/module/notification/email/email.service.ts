import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { emailTemplate } from './template/email.template';

@Injectable()
export class EmailService {
  constructor(
    public readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async sendEmail(): Promise<void> {
    const from: string = this.configService.get<string>('API_EMAIL_FROM');
    const drwNo = await this.redis.get('drwNo');
    const drwtNo1 = await this.redis.get('drwtNo1');
    const drwtNo2 = await this.redis.get('drwtNo2');
    const drwtNo3 = await this.redis.get('drwtNo3');
    const drwtNo4 = await this.redis.get('drwtNo4');
    const drwtNo5 = await this.redis.get('drwtNo5');
    const drwtNo6 = await this.redis.get('drwtNo6');
    const bnusNo = await this.redis.get('bnusNo');
    const drwNoDate = await this.redis.get('drwNoDate');

    console.log('✅ drwNo: ', drwNo);
    console.log('✅ drwtNo1: ', drwtNo1);
    console.log('✅ drwtNo2: ', drwtNo2);
    console.log('✅ drwtNo3: ', drwtNo3);
    console.log('✅ drwtNo4: ', drwtNo4);
    console.log('✅ drwtNo5: ', drwtNo5);
    console.log('✅ drwtNo6: ', drwtNo6);
    console.log('✅ bnusNo: ', bnusNo);
    console.log('✅ drwNoDate: ', drwNoDate);

    try {
      // await this.mailerService.sendMail({ to: 'kk_ong2233@naver.com', from, subject: 'test', html: emailTemplate() });
    } catch (err) {
      throw new BadRequestException('메일 전송에 실패했습니다.');
    }
  }
}
