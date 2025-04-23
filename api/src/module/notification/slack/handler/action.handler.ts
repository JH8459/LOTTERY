import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ActionService } from '../util/action.service';
import { SlackActionIDEnum } from '../constant/slack.enum';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SUBSCRIBE_TYPE } from 'src/common/constant/enum';
import { CustomLoggerService } from 'src/module/logger/logger.service';

/**
 * @description ActionHandler는 Slack App의 BlockActions 이벤트를 처리하는 핸들러 클래스입니다.
 * @constructor
 * @param {ActionService} actionService - ActionService 인스턴스입니다.
 * @param {CustomLoggerService} loggerService - CustomLoggerService 인스턴스입니다.
 */
@Injectable()
export class ActionHandler {
  constructor(private readonly actionService: ActionService, private readonly loggerService: CustomLoggerService) {}

  /**
   * @description Slack 액션 이벤트를 액션 ID에 따라 처리합니다.
   * @param {WebClient} client - Slack WebClient 인스턴스입니다.
   * @param {SlackInteractionPayload} body - Slack Interaction Payload입니다.
   * @returns {Promise<void>}
   */
  async registerActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    const actionId: string = body.actions[0].action_id;

    switch (actionId) {
      case SlackActionIDEnum.PRIZE_INFO:
        return this.handlePrizeInfo(client, body);

      case SlackActionIDEnum.RECENTLY_PRIZE_INFO:
        return this.handleRecentlyPrizeInfo(client, body);

      case SlackActionIDEnum.STATISTIC_PRIZE_INFO:
        return this.handleStatisticPrizeInfo(client, body);

      case SlackActionIDEnum.SPEETTO_INFO:
        return this.handleSpeettoInfo(client, body);

      case SlackActionIDEnum.SLACK_SUBSCRIBE:
        return this.handleSlackSubscribe(client, body);

      case SlackActionIDEnum.SLACK_UNSUBSCRIBE:
        return this.handleUnsubscribe(client, body, SUBSCRIBE_TYPE.SLACK);

      case SlackActionIDEnum.EMAIL_SUBSCRIBE_INPUT:
        return this.handleEmailSubscribeInput(client, body);

      case SlackActionIDEnum.EMAIL_UNSUBSCRIBE:
        return this.handleUnsubscribe(client, body, SUBSCRIBE_TYPE.EMAIL);

      case SlackActionIDEnum.EMAIL_RESEND_VERIFICATION_CODE:
        return this.handleResendVerificationCode(client, body);

      default:
        this.loggerService.warn(`[SlackActionHandler] Unknown action ID: ${actionId}`);
    }
  }

  private async handlePrizeInfo(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.prizeInfoActionHandler(client, body);
  }

  private async handleRecentlyPrizeInfo(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.recentlyPrizeInfoActionHandler(client, body);
  }

  private async handleStatisticPrizeInfo(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.statisticPrizeInfoActionHandler(client, body);
  }

  private async handleSpeettoInfo(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.speettoInfoActionHandler(client, body);
  }

  private async handleSlackSubscribe(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.slackSubscribeActionHandler(client, body);
  }

  private async handleUnsubscribe(
    client: WebClient,
    body: SlackInteractionPayload,
    type: SUBSCRIBE_TYPE
  ): Promise<void> {
    await this.actionService.unSubscribeActionHandler(client, body, type);
  }

  private async handleEmailSubscribeInput(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.emailSubscribeInputActionHandler(client, body);
  }

  private async handleResendVerificationCode(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.actionService.emailResendVerificationCodeActionHandler(client, body);
  }
}
