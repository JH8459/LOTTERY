import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, ExpressReceiver, View } from '@slack/bolt';
import { CommandsService } from './util/commands/commands.service';
import { SlackActionIDEnum } from './constant/slack.enum';
import { ActionsService } from './util/actions/actions.service';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(
    public readonly configService: ConfigService,
    private readonly commandsService: CommandsService,
    private readonly actionsService: ActionsService
  ) {}

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
      const modal: View = await this.commandsService.getPrizeInfoModal();
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

  async slackActionsHandler(actionId: string, value: string, body: any): Promise<void> {
    const app = this.getSlackApp();

    switch (actionId) {
      case SlackActionIDEnum.RECENTLY_PRIZE_INFO:
        // 현재 열린 모달 창 업데이트.
        await app.client.views.update({
          view_id: body.view.id,
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: '당첨 정보 조회',
            },
            blocks: await this.actionsService.getPrizeInfoBlock(),
            close: {
              type: 'plain_text',
              text: '닫기',
            },
          },
        });
        break;
      default:
        break;
    }
  }
}
