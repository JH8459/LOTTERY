import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, ExpressReceiver } from '@slack/bolt';
import Redis from 'ioredis';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(public readonly configService: ConfigService, @InjectRedis() private readonly redis: Redis) {}

  private app: App;
  private receiver: ExpressReceiver;

  onModuleInit() {
    this.receiver = new ExpressReceiver({
      signingSecret: this.configService.get<string>('API_SLACK_SIGNING_SECRET'),
    });

    this.app = new App({
      token: this.configService.get<string>('API_SLACK_BOT_TOKEN'),
      receiver: this.receiver,
    });

    // '/당첨정보' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.app.command('/당첨정보', async ({ command, ack, say }) => {
      console.log('✅ command:', command);

      // Command 요청을 확인합니다.
      await ack();

      // Command에 대한 응답을 보냅니다.
      await say(`Hello, <@${command.user_id}>!`);
    });
  }

  getSlackApp() {
    return this.app;
  }

  getReceiver() {
    return this.receiver;
  }

  // async getCommandsLotteryInfo() {
  //   this.app.command('/당첨정보', async ({ command, ack, say }) => {
  //     await ack();

  //     await say(`Hello, <@${command.user_id}>!`);
  //   });
  // }
}
