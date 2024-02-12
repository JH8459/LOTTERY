import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { emailTemplate } from './template/email.template';
import { InputEmailDto } from '../dto/inputEmail.dto';
import { convertDateFormat } from 'src/common/utils/utils';

@Injectable()
export class EmailService {
  constructor(
    public readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async sendEmail(emailInfo: any): Promise<void> {
    const from: string = this.configService.get<string>('API_EMAIL_FROM');
    const drwNo: number = Number(await this.redis.get('drwNo'));
    const drwtNo1: number = Number(await this.redis.get('drwtNo1'));
    const drwtNo2: number = Number(await this.redis.get('drwtNo2'));
    const drwtNo3: number = Number(await this.redis.get('drwtNo3'));
    const drwtNo4: number = Number(await this.redis.get('drwtNo4'));
    const drwtNo5: number = Number(await this.redis.get('drwtNo5'));
    const drwtNo6: number = Number(await this.redis.get('drwtNo6'));
    const bnusNo: number = Number(await this.redis.get('bnusNo'));
    const drwNoDate: Date = new Date(await this.redis.get('drwNoDate'));

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
      await this.mailerService.sendMail({
        to: emailInfo,
        from,
        subject: `[${convertDateFormat(drwNoDate)}] ${drwNo}회 당첨결과 🍀`,
        html: emailTemplate(),
      });
    } catch (err) {
      throw new BadRequestException('메일 전송에 실패했습니다.');
    }
  }
}
