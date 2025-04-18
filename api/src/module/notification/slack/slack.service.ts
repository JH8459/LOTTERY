import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, ExpressReceiver } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { SlackActionIDEnum, SlackBlockIDEnum } from './constant/slack.enum';
import { SlackRepository } from './repository/slack.repository';
import axios, { AxiosResponse } from 'axios';
import * as querystring from 'querystring';
import { CommandService } from './util/command.service';
import { SlackInteractionPayload } from './interface/payload.interface';
import { ActionService } from './util/action.service';
import { ViewSubmissionService } from './util/viewSubmission.service';
import { ClientService } from './util/client.service';

@Injectable()
export class SlackService implements OnModuleInit {
  private APP: App;
  private RECEIVER: ExpressReceiver;
  private readonly API_SLACK_SIGNING_SECRET: string;
  private readonly API_SLACK_BOT_TOKEN: string;
  private readonly API_SLACK_CLIENT_ID: string;
  private readonly API_SLACK_CLIENT_SECRET: string;

  constructor(
    public readonly configService: ConfigService,
    private readonly slackRepository: SlackRepository,
    private readonly commandService: CommandService,
    private readonly actionService: ActionService,
    private readonly viewSubMissionService: ViewSubmissionService,
    private readonly clientService: ClientService
  ) {
    this.API_SLACK_SIGNING_SECRET = this.configService.get<string>('API_SLACK_SIGNING_SECRET');
    this.API_SLACK_BOT_TOKEN = this.configService.get<string>('API_SLACK_BOT_TOKEN');
    this.API_SLACK_CLIENT_ID = this.configService.get<string>('API_SLACK_CLIENT_ID');
    this.API_SLACK_CLIENT_SECRET = this.configService.get<string>('API_SLACK_CLIENT_SECRET');
  }

  onModuleInit() {
    this.RECEIVER = new ExpressReceiver({
      signingSecret: this.API_SLACK_SIGNING_SECRET,
    });

    this.APP = new App({
      token: this.API_SLACK_BOT_TOKEN,
      receiver: this.RECEIVER,
    });

    // '/로또' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.APP.command('/로또', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 로또 당첨 정보 조회 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.lottoPrizeInfoCommandHandler(command);
    });

    // '/스피또' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.APP.command('/스피또', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 스피또 당첨 정보 조회 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.speettoPrizeInfoCommandHandler(command);
    });

    // '/구독' command를 처리하는 이벤트 핸들러를 등록합니다.
    this.APP.command('/구독', async ({ command, ack }) => {
      // Command 요청을 확인합니다.
      await ack();
      // 구독 Command를 처리하는 메서드를 호출합니다.
      await this.commandService.subscribeCommandHandler(command);
    });
  }

  getSlackApp() {
    return this.APP;
  }

  getReceiver() {
    return this.RECEIVER;
  }

  async getAccessToken(code: string): Promise<string> {
    const oauthResponse: AxiosResponse = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      querystring.stringify({
        client_id: this.API_SLACK_CLIENT_ID,
        client_secret: this.API_SLACK_CLIENT_SECRET,
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

    // 클라이언트를 생성합니다.
    const actionId: string = body.actions[0].action_id;
    const client: WebClient = await this.clientService.getWebClientById(body.user.team_id);

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
      case SlackActionIDEnum.SLACK_SUBSCRIBE:
        await this.actionService.slackSubscribeActionHandler(client, body);
        break;
      case SlackActionIDEnum.SLACK_UNSUBSCRIBE:
        await this.actionService.slackUnSubscribeActionHandler(client, body);
        break;
      case SlackActionIDEnum.EMAIL_SUBSCRIBE:
        await this.actionService.slackSubscribeActionHandler(client, body);
        break;
      default:
        break;
    }
  }

  async slackViewSubMissionHandler(ack: any, body: SlackInteractionPayload): Promise<void> {
    const teamId: string = body.team.id;
    const viewValue = body.view.state.values;

    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClientById(teamId);

    // View input Value 값을 구분하여 View Submission을 처리합니다.
    switch (true) {
      case SlackBlockIDEnum.ORDER_INPUT in viewValue:
        await this.viewSubMissionService.lottoPrizeInfoViewSubmissionHandler(ack, client, body);
        break;
      case SlackBlockIDEnum.SPEETTO_INPUT in viewValue:
        await this.viewSubMissionService.speettoPrizeInfoViewSubmissionHandler(ack, client, body);
        break;
      case SlackBlockIDEnum.SLACK_FEEDBACK_INPUT in viewValue:
        await this.viewSubMissionService.unSubscribeViewSubmissionHandler(ack, client, body);
        break;
      default:
        break;
    }
  }
}
