import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, ExpressReceiver } from '@slack/bolt';

@Injectable()
/**
 * @description: SlackAppFactory는 Slack App과 ExpressReceiver를 생성하는 팩토리 클래스입니다. (App, Receiver 초기화 책임을 가지고 있습니다.)
 * @constructor
 * @param {ConfigService} configService - NestJS ConfigService 인스턴스입니다.
 * @property {string} API_SLACK_SIGNING_SECRET - Slack Signing Secret입니다.
 * @property {string} API_SLACK_BOT_TOKEN - Slack Bot Token입니다.
 */
export class SlackAppFactory {
  private readonly API_SLACK_SIGNING_SECRET: string;
  private readonly API_SLACK_BOT_TOKEN: string;

  constructor(public readonly configService: ConfigService) {
    this.API_SLACK_SIGNING_SECRET = this.configService.get<string>('API_SLACK_SIGNING_SECRET');
    this.API_SLACK_BOT_TOKEN = this.configService.get<string>('API_SLACK_BOT_TOKEN');
  }

  /**
   * @description: Slack App과 ExpressReceiver를 생성하는 메서드입니다.
   * @returns { app: App; receiver: ExpressReceiver }
   */
  public createSlackApp(): { app: App; receiver: ExpressReceiver } {
    const receiver = new ExpressReceiver({
      signingSecret: this.API_SLACK_SIGNING_SECRET,
    });

    const app = new App({
      token: this.API_SLACK_BOT_TOKEN,
      receiver,
    });

    return { app, receiver };
  }
}
