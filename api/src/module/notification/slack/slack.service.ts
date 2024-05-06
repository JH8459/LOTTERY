import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, ExpressReceiver, View } from '@slack/bolt';
import { PrizeInfoService } from './util/commands/prizeInfo.service';
import { SlackActionIDEnum } from './constant/slack.enum';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(public readonly configService: ConfigService, private readonly prizeInfoService: PrizeInfoService) {}

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
    this.app.command('/당첨정보', async ({ command, ack, client }) => {
      // Command 요청을 확인합니다.
      await ack();
      // Block Kit을 사용하여 모달을 구성합니다.
      const modal: View = await this.prizeInfoService.getPrizeInfoModal();
      // 모달을 출력합니다.
      await client.views.open({
        trigger_id: command.trigger_id,
        view: modal,
      });
    });
  }

  getSlackApp() {
    return this.app;
  }

  getReceiver() {
    return this.receiver;
  }

  async slackActionsHandler(actionId: string, body: any): Promise<void> {
    const app = this.getSlackApp();

    switch (actionId) {
      case SlackActionIDEnum.RECENTLY_PRIZE_INFO:
        // 액션을 요청한 사용자에게만 'Hello' 메시지를 보냅니다.
        await app.client.chat.postEphemeral({
          channel: body.user.id,
          user: body.user.id,
          text: 'Hello',
        });
        break;
      default:
        break;
    }
  }
}
