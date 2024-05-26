import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, Block, ExpressReceiver, View } from '@slack/bolt';
import { SlackActionIDEnum, SlackBlockIDEnum, SlackSubMitButtonNameEnum } from './constant/slack.enum';
import { BuilderService } from './builder.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { SlackRepository } from './repository/slack.repository';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { LottoInfoInterface } from '../interface/lotto.interface';
import axios, { AxiosResponse } from 'axios';
import * as querystring from 'querystring';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(
    public readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    private slackRepository: SlackRepository,
    private readonly builderService: BuilderService
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

      let recentlyDrwNo: number = Number(await this.redis.get('drwNo'));

      if (!recentlyDrwNo) {
        recentlyDrwNo = await this.slackRepository.getRecentlyDrwNo();
      }

      // 모달을 출력합니다.
      await client.views.open({
        trigger_id: command.trigger_id,
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: '당첨 정보 조회',
          },
          blocks: await this.builderService.getPrizeInfoBlock(recentlyDrwNo),
          close: {
            type: 'plain_text',
            text: '닫기',
          },
          submit: {
            type: 'plain_text',
            text: '조회',
          },
        },
      });
    });

    // '/구독' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.app.command('/구독', async ({ command, ack, client }) => {
      // Command 요청을 확인합니다.
      await ack();

      console.log('✅ command: ', command);

      // 명령어를 실행한 유저의 정보를 조회합니다.
      const userId = command.user_id;

      try {
        // const userInfo = await client.users.info({ user: userId });
        // console.log('✅ userInfo: ', userInfo);
        // 유저와 앱 간의 개인 채널을 엽니다.
        const response = await client.conversations.open({
          users: userId,
        });

        console.log('✅ response: ', response);
        // // 유저의 앱 채널에서 메시지를 발송합니다.
        await client.chat.postMessage({
          channel: response.channel.id,
          text: `안녕하세요, 구독 명령어를 실행해주셔서 감사합니다. 아직 준비중인 기능이라서 구독은 불가능합니다. 🍀`,
        });
      } catch (error) {
        console.error('❌ Error2: ', error.data);
      }
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

      return `https://${teamInfoResponse.data.team.domain}.slack.com/app_redirect?app=${oauthResponse.data.app_id}`;
    } else {
      return `https://slack.com`;
    }
  }

  async slackBlockActionsHandler(ack: any, body: any): Promise<void> {
    await ack();

    const app = this.getSlackApp();

    const actionId: string = body.actions[0].action_id;
    const value: string = body.actions[0].value;

    let recentlyDrwNo: number = Number(await this.redis.get('drwNo'));

    if (!recentlyDrwNo) {
      recentlyDrwNo = await this.slackRepository.getRecentlyDrwNo();
    }

    switch (actionId) {
      case SlackActionIDEnum.PRIZE_INFO:
        await app.client.views.update({
          view_id: body.view.id,
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: '당첨 정보 조회',
            },
            blocks: await this.builderService.getPrizeInfoBlock(recentlyDrwNo),
            close: {
              type: 'plain_text',
              text: '닫기',
            },
            submit: {
              type: 'plain_text',
              text: SlackSubMitButtonNameEnum.SEARCH,
            },
          },
        });
        break;
      case SlackActionIDEnum.RECENTLY_PRIZE_INFO:
        await app.client.views.update({
          view_id: body.view.id,
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: `당첨 정보 조회 / ${convertKRLocaleStringFormat(recentlyDrwNo)}회`,
            },
            blocks: await this.builderService.getDrwnoPrizeInfoBlock(),
            close: {
              type: 'plain_text',
              text: '닫기',
            },
          },
        });
        break;
      case SlackActionIDEnum.STATISTIC_PRIZE_INFO:
        await app.client.views.update({
          view_id: body.view.id,
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: `당첨 정보 조회 / 통계 조회`,
            },
            blocks: await this.builderService.getStatisticPrizeInfoBlock(),
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

  async slackViewSubMissionHandler(ack: any, body: any): Promise<void> {
    const app = this.getSlackApp();

    const viewId: string = body.view.id;
    const viewValue: string = body.view.state.values;

    const recentlyDrwNo: number = Number(await this.redis.get('drwNo'));
    const drwNo: number = Number(viewValue[SlackBlockIDEnum.ORDER_INPUT][SlackActionIDEnum.ORDER_INPUT].value);

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

      await app.client.views.update({
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

      await app.client.views.open({
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
