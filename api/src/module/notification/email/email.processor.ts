import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { CustomLoggerService } from 'src/module/logger/logger.service';

@Processor('emailQueue')
@Injectable()
export class EmailProcessor {
  constructor(private readonly loggerService: CustomLoggerService, private readonly emailService: EmailService) {}

  @Process('sendEmail')
  async handleSendEmail(job: Job<ISendMailOptions>) {
    this.loggerService.log(`이메일 발송: ${job.data.to}`);

    await this.emailService.sendLottoEmail(job.data);
  }
}
