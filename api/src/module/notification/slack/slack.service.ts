import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, ExpressReceiver } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { SlackActionIDEnum, SlackBlockIDEnum } from './constant/slack.enum';
import { SlackRepository } from './repository/slack.repository';
import axios, { AxiosResponse } from 'axios';
import * as querystring from 'querystring';
import { CommandService } from './service/command.service';
import { SlackInteractionPayload } from './interface/payload.interface';
import { ActionService } from './service/action.service';
import { ViewSubmissionService } from './service/viewSubmission.service';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(
    public readonly configService: ConfigService,
    private slackRepository: SlackRepository,
    private readonly commandService: CommandService,
    private readonly actionService: ActionService,
    private readonly viewSubMissionService: ViewSubmissionService
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

    // '/로또' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.app.command('/로또', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 로또 당첨 정보 조회 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.lottoPrizeInfoCommandHandler(command);
    });

    // '/스피또' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.app.command('/스피또', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 스피또 당첨 정보 조회 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.speettoPrizeInfoCommandHandler(command);
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
      case SlackActionIDEnum.SPEETTO_INFO:
        await this.actionService.speettoInfoActionHandler(client, body);
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
    const viewValue = body.view.state.values;
    // 저장된 토큰을 가져와 클라이언트를 생성합니다.
    const token: string = await this.slackRepository.getAccessToken(teamId);
    const client: WebClient = new WebClient(token);
    // View input Value 값을 구분하여 View Submission을 처리합니다.
    switch (true) {
      case SlackBlockIDEnum.ORDER_INPUT in viewValue:
        await this.viewSubMissionService.lottoPrizeInfoViewSubmissionHandler(ack, client, body);
        break;
      case SlackBlockIDEnum.SPEETTO_INPUT in viewValue:
        await this.viewSubMissionService.speettoPrizeInfoViewSubmissionHandler(ack, client, body);
        break;
      case SlackBlockIDEnum.FEEDBACK_INPUT in viewValue:
        await this.viewSubMissionService.feedbackViewSubmissionHandler(ack, client, body);
        break;
      default:
        break;
    }
  }
}
