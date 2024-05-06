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
  }

  getSlackApp() {
    return this.app;
  }

  getReceiver() {
    return this.receiver;
  }

  async getCommandsLotteryInfo() {
    this.app.command('/당첨정보', async ({ command, ack, say }) => {
      await ack();

      await say(`Hello, <@${command.user_id}>!`);
    });
  }
}
