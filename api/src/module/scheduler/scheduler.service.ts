import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly emailService: EmailService) {}

  @Cron('0 9 * * 0', { timeZone: 'Asia/Seoul' })
  async sendLottoEmailToSubscriberListScheduler(): Promise<void> {
    await this.emailService.sendLottoEmailToSubscriberList();
  }
}
