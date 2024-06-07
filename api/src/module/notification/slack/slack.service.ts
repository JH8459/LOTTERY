import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, Block, ExpressReceiver } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { SlackActionIDEnum, SlackBlockIDEnum, SlackSubMitButtonNameEnum } from './constant/slack.enum';
import { BuilderService } from './service/builder.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { SlackRepository } from './repository/slack.repository';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { LottoInfoInterface } from '../interface/lotto.interface';
import axios, { AxiosResponse } from 'axios';
import * as querystring from 'querystring';
import { UserInfoDto } from './dto/user.dto';
import { CommandService } from './service/command.service';
import { SlackInteractionPayload } from './interface/payload.interface';
import { ActionService } from './service/action.service';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(
    public readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    private slackRepository: SlackRepository,
    private readonly builderService: BuilderService,
    private readonly commandService: CommandService,
    private readonly actionService: ActionService
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
    this.app.command('/당첨정보', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 당첨 정보 조회 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.prizeInfoCommandHandler(command);
    });

    // '/구독' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.app.command('/구독', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 구독 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.subscribeCommandHandler(command);
    });
  }

  getSlackApp() {
    return this.app;
  }

  getReceiver() {
    return this.receiver;
  }

  async getAccessToken(code: string): Promise<string> {
    const oauthResponse: AxiosResponse = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      querystring.stringify({
        client_id: this.configService.get<string>('API_SLACK_CLIENT_ID'),
        client_secret: this.configService.get<string>('API_SLACK_CLIENT_SECRET'),
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (oauthResponse.data.ok) {
      const teamInfoResponse: AxiosResponse = await axios.get('https://slack.com/api/team.info', {
        headers: {
          Authorization: `Bearer ${oauthResponse.data.access_token}`,
        },
      });

      const workspaceName: string = teamInfoResponse.data.team.name;
      const workspaceId: string = teamInfoResponse.data.team.id;
      const accessToken: string = oauthResponse.data.access_token;

      await this.slackRepository.saveAccessToken(workspaceName, workspaceId, accessToken);

      return `https://${teamInfoResponse.data.team.domain}.slack.com/app_redirect?app=${oauthResponse.data.app_id}`;
    } else {
      return `https://slack.com`;
    }
  }

  async slackBlockActionsHandler(ack: any, body: SlackInteractionPayload): Promise<void> {
    await ack();

    const actionId: string = body.actions[0].action_id;
    const value: string = body.actions[0].value;
    // 저장된 토큰을 가져와 클라이언트를 생성합니다.
    const token: string = await this.slackRepository.getAccessToken(body.user.team_id);
    const client: WebClient = new WebClient(token);

    switch (actionId) {
      case SlackActionIDEnum.PRIZE_INFO:
        await this.actionService.prizeInfoActionHandler(client, body);
        break;
      case SlackActionIDEnum.RECENTLY_PRIZE_INFO:
        await this.actionService.recentlyPrizeInfoActionHandler(client, body);
        break;
      case SlackActionIDEnum.STATISTIC_PRIZE_INFO:
        await this.actionService.statisticPrizeInfoActionHandler(client, body);
        break;
      case SlackActionIDEnum.SUBSCRIBE:
        await this.actionService.subscribeActionHandler(client, body);
        break;
      case SlackActionIDEnum.UN_SUBSCRIBE:
        await this.actionService.unSubscribeActionHandler(client, body);
        break;
      default:
        break;
    }
  }

  async slackViewSubMissionHandler(ack: any, body: SlackInteractionPayload): Promise<void> {
    const teamId: string = body.team.id;
    const viewId: string = body.view.id;
    const viewValue: string = body.view.state.values;
    // 저장된 토큰을 가져와 클라이언트를 생성합니다.
    const token: string = await this.slackRepository.getAccessToken(teamId);
    const client: WebClient = new WebClient(token);

    const recentlyDrwNo: number = Number(await this.redis.get('drwNo'));
    const drwNo: number = Number(viewValue[SlackBlockIDEnum.ORDER_INPUT][SlackActionIDEnum.ORDER_INPUT].value);

    console.log('✅ body: ', body);

    if (drwNo > recentlyDrwNo || drwNo <= 0 || !drwNo) {
      const originalBlocks = body.view.blocks;
      let errorMessage: string;

      if (drwNo > recentlyDrwNo) {
        errorMessage = `⚠️ 가장 최신 회차(${convertKRLocaleStringFormat(recentlyDrwNo)}회)까지 조회가 가능합니다.`;
      } else if (drwNo <= 0) {
        errorMessage = '⚠️ 1회차보다 작은 회차 정보는 조회가 불가능합니다.';
      } else {
        errorMessage = '⚠️ 숫자 외의 정보는 조회가 불가능합니다.';
      }

      const blockIndex: number = originalBlocks.findIndex(
        (block: Block) => block.block_id === SlackBlockIDEnum.INPUT_ERROR_MESSAGE
      );

      if (blockIndex !== -1) {
        originalBlocks[blockIndex] = {
          type: 'section',
          block_id: SlackBlockIDEnum.INPUT_ERROR_MESSAGE,
          text: {
            type: 'mrkdwn',
            text: errorMessage,
          },
        };
      } else {
        originalBlocks.push({
          type: 'section',
          block_id: SlackBlockIDEnum.INPUT_ERROR_MESSAGE,
          text: {
            type: 'mrkdwn',
            text: errorMessage,
          },
        });
      }

      await client.views.update({
        view_id: viewId,
        view: {
          type: 'modal',
          title: body.view.title,
          blocks: originalBlocks,
          close: body.view.close,
          submit: body.view.submit,
        },
      });

      await ack({
        response_action: 'update',
        view: {
          type: 'modal',
          title: body.view.title,
          blocks: originalBlocks,
          close: body.view.close,
          submit: body.view.submit,
        },
      });
    } else {
      const lottoInfo: LottoInfoInterface = await this.slackRepository.getLottoInfo(drwNo);

      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: `당첨 정보 조회 / ${convertKRLocaleStringFormat(lottoInfo.drwNo)}회`,
          },
          blocks: await this.builderService.getDrwnoPrizeInfoBlock(lottoInfo),
          close: {
            type: 'plain_text',
            text: '닫기',
          },
        },
      });

      await ack({
        response_action: 'update',
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: `당첨 정보 조회 / ${convertKRLocaleStringFormat(lottoInfo.drwNo)}회`,
          },
          blocks: await this.builderService.getDrwnoPrizeInfoBlock(lottoInfo),
          close: {
            type: 'plain_text',
            text: '닫기',
          },
        },
      });
    }
  }
}
