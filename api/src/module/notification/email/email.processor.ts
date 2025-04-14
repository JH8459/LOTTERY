import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Processor('emailQueue')
@Injectable()
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('sendEmail')
  async handleSendEmail(job: Job<ISendMailOptions>) {
    console.log(`Sending email to ${job.data.to}...`);

    await this.emailService.sendLottoEmail(job.data);
  }
}
