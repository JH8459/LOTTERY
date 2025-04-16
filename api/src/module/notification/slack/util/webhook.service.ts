import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CustomLoggerService } from 'src/module/logger/logger.service';
import { CustomBadRequestException } from 'src/common/custom/exception/exception.service';

@Injectable()
export class WebHookService {
  private readonly API_SLACK_WEBHOOK_URL: string;

  constructor(public readonly configService: ConfigService, private readonly loggerService: CustomLoggerService) {
    this.API_SLACK_WEBHOOK_URL = this.configService.get<string>('API_SLACK_WEBHOOK_URL');
  }

  async sendSlackWebHookMessage(message: string): Promise<void> {
    if (!this.API_SLACK_WEBHOOK_URL) {
      throw new CustomBadRequestException('Slack Webhook 환경변수가 올바르게 설정되지 않았습니다.');
    }

    try {
      await axios.post(this.API_SLACK_WEBHOOK_URL, {
        text: message,
      });
    } catch (error) {
      throw new CustomBadRequestException('Slack Webhook 메시지 전송에 실패했습니다.');
    }
  }
}
