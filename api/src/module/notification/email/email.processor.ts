import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { CustomLoggerService } from 'src/module/logger/logger.service';
import { WebHookService } from '../slack/util/webhook.service';

@Processor('emailQueue')
@Injectable()
export class EmailProcessor {
  constructor(
    private readonly emailService: EmailService,
    private readonly webHookService: WebHookService,
    private readonly loggerService: CustomLoggerService
  ) {}

  /**
   * @description 이메일 전송을 위한 큐에서 작업을 처리합니다.
   * @param job - Bull Job 객체
   * @returns void
   */
  @Process('sendEmail')
  async handleSendEmail(job: Job<ISendMailOptions>) {
    try {
      await this.emailService.sendLottoEmail(job.data);
    } catch (error) {
      const email = job.data?.to ?? '알 수 없음';

      throw new Error(`[이메일 전송 실패] 수신자: ${email}, 이유: ${error.message}`);
    }
  }

  /**
   * @description 이메일 전송 작업이 실패했을 때 호출되는 메서드입니다.
   * @param job - Bull Job 객체
   * @param error - 에러 객체
   * @returns void
   */
  @OnQueueFailed()
  async handleFailedJob(job: Job<any>, error: Error) {
    const isFinalAttempt = job.attemptsMade === job.opts.attempts;
    const email = job.data?.to ?? '알 수 없음';
    const message = `[이메일 전송 실패] 수신자: ${email}, 이유: ${error.message}`;

    if (isFinalAttempt) {
      // 에러 로그를 남깁니다.
      await this.loggerService.error(message, error.stack);
      // 슬랙에 에러 메시지를 전송합니다.
      await this.webHookService.sendSlackWebHookMessage(message);
    }
  }
}
