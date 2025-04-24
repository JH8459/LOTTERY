import { Injectable, OnModuleInit } from '@nestjs/common';
import { App, ExpressReceiver } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { SlackInteractionPayload } from './interface/payload.interface';
import { ClientService } from './util/client.service';
import { SlackAppFactory } from './config/slackAppFactory';
import { CommandHandler } from './handler/command.handler';
import { ActionHandler } from './handler/action.handler';
import { ViewSubmissionHandler } from './handler/viewSubmission.handler';
import { AuthService } from './util/auth.service';

@Injectable()
export class SlackService implements OnModuleInit {
  private APP: App;
  private RECEIVER: ExpressReceiver;

  constructor(
    private readonly slackAppFactory: SlackAppFactory,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private readonly commandHandler: CommandHandler,
    private readonly actionHandler: ActionHandler,
    private readonly viewSubmissionHandler: ViewSubmissionHandler
  ) {
    // Slack App과 ExpressReceiver를 생성합니다.
    const { app, receiver } = this.slackAppFactory.createSlackApp();
    this.APP = app;
    this.RECEIVER = receiver;
  }

  onModuleInit() {
    // Slack Slash Command를 처리하는 핸들러를 등록합니다.
    this.commandHandler.registerCommandHandler(this.APP);
  }

  getSlackApp() {
    return this.APP;
  }

  getReceiver() {
    return this.RECEIVER;
  }

  async authorizeSlackCode(code: string): Promise<string> {
    const url: string = await this.authService.authorizeSlackCode(code);

    return url;
  }

  async slackBlockActionsHandler(ack: any, body: SlackInteractionPayload): Promise<void> {
    await ack();

    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClientById(body.user.team_id);
    // 핸들러를 등록합니다.
    await this.actionHandler.registerActionHandler(client, body);
  }

  async slackViewSubMissionHandler(ack: any, body: SlackInteractionPayload): Promise<void> {
    const teamId: string = body.team.id;

    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClientById(teamId);
    // 핸들러를 등록합니다.
    await this.viewSubmissionHandler.registerViewSubmissionHandler(ack, client, body);
  }
}
