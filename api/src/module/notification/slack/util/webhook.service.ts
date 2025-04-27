import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException } from 'src/common/custom/exception/exception.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebHookService {
  private readonly API_SLACK_WEBHOOK_URL: string;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
    this.API_SLACK_WEBHOOK_URL = this.configService.get<string>('API_SLACK_WEBHOOK_URL');
  }

  async sendSlackWebHookMessage(message: string): Promise<void> {
    if (!this.API_SLACK_WEBHOOK_URL) {
      throw new CustomBadRequestException('Slack Webhook 환경변수가 올바르게 설정되지 않았습니다.');
    }

    try {
      await firstValueFrom(
        this.httpService.post(this.API_SLACK_WEBHOOK_URL, {
          text: message,
        })
      );
    } catch (error) {
      throw new CustomBadRequestException('Slack Webhook 메시지 전송에 실패했습니다.');
    }
  }
}
