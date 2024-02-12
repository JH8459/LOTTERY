import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { emailTemplate } from './template/email.template';
import { InputEmailDto } from './dto/inputEmail.dto';
import { convertDateFormat } from 'src/common/utils/utils';

@Injectable()
export class EmailService {
  constructor(
    public readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async sendEmail({ emailInfo }: InputEmailDto): Promise<void> {
    const from: string = this.configService.get<string>('API_EMAIL_FROM');

    const mailInfo = {
      drwNo: Number(await this.redis.get('drwNo')),
      drwtNo1: Number(await this.redis.get('drwtNo1')),
      drwtNo2: Number(await this.redis.get('drwtNo2')),
      drwtNo3: Number(await this.redis.get('drwtNo3')),
      drwtNo4: Number(await this.redis.get('drwtNo4')),
      drwtNo5: Number(await this.redis.get('drwtNo5')),
      drwtNo6: Number(await this.redis.get('drwtNo6')),
      bnusNo: Number(await this.redis.get('bnusNo')),
      drwNoDate: new Date(await this.redis.get('drwNoDate')),
    };

    try {
      await this.mailerService.sendMail({
        to: emailInfo,
        from,
        subject: `[${convertDateFormat(mailInfo.drwNoDate)}] ${mailInfo.drwNo}회 당첨결과 🍀`,
        html: emailTemplate(mailInfo),
      });
    } catch (err) {
      throw new BadRequestException('메일 전송에 실패했습니다.');
    }
  }
}
