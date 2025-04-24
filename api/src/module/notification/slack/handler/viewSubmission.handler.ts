import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ViewSubmissionService } from '../util/viewSubmission.service';
import { SlackBlockIDEnum } from '../constant/slack.enum';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SUBSCRIBE_TYPE } from 'src/common/constant/enum';
import { CustomLoggerService } from 'src/module/logger/logger.service';

/**
 * @description ViewSubmissionHandler는 Slack App의 viewSubmission 요청을 처리하는 핸들러 클래스입니다.
 * @constructor
 * @param {ViewSubmissionService} viewSubmissionService - ViewSubmissionService 인스턴스입니다.
 * @param {CustomLoggerService} loggerService - CustomLoggerService 인스턴스입니다.
 */
@Injectable()
export class ViewSubmissionHandler {
  constructor(
    private readonly viewSubmissionService: ViewSubmissionService,
    private readonly loggerService: CustomLoggerService
  ) {}

  /**
   * @description Slack viewSubmission 요청을 블록 ID 기준으로 분기 처리합니다.
   * @param {any} ack - Slack의 ack 함수입니다.
   * @param {WebClient} client - Slack WebClient 인스턴스입니다.
   * @param {SlackInteractionPayload} body - Slack Interaction Payload입니다.
   * @returns {Promise<void>}
   */
  async registerViewSubmissionHandler(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    const viewValue = body.view.state.values;
    const keys = Object.keys(viewValue);

    if (keys.includes(SlackBlockIDEnum.ORDER_INPUT)) {
      return this.handleOrderInput(ack, client, body);
    }

    if (keys.includes(SlackBlockIDEnum.SPEETTO_INPUT)) {
      return this.handleSpeettoInput(ack, client, body);
    }

    if (keys.includes(SlackBlockIDEnum.SLACK_FEEDBACK_INPUT)) {
      return this.handleSlackFeedback(ack, client, body);
    }

    if (keys.includes(SlackBlockIDEnum.EMAIL_FEEDBACK_INPUT)) {
      return this.handleEmailFeedback(ack, client, body);
    }

    if (keys.includes(SlackBlockIDEnum.EMAIL_CONFIRM_INPUT)) {
      return this.handleEmailConfirm(ack, client, body);
    }

    if (keys.includes(SlackBlockIDEnum.EMAIL_VERIFICATION_CODE)) {
      return this.handleEmailVerificationCode(ack, client, body);
    }

    this.loggerService.warn(`[ViewSubmissionHandler] 알 수 없는 viewSubmission 요청입니다. keys: ${keys.join(', ')}`);
  }

  private async handleOrderInput(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.viewSubmissionService.lottoPrizeInfoViewSubmissionHandler(ack, client, body);
  }

  private async handleSpeettoInput(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.viewSubmissionService.speettoPrizeInfoViewSubmissionHandler(ack, client, body);
  }

  private async handleSlackFeedback(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.viewSubmissionService.feedbackViewSubmissionHandler(ack, client, body, SUBSCRIBE_TYPE.SLACK);
  }

  private async handleEmailFeedback(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.viewSubmissionService.feedbackViewSubmissionHandler(ack, client, body, SUBSCRIBE_TYPE.EMAIL);
  }

  private async handleEmailConfirm(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.viewSubmissionService.emailConfirmViewSubmissionHandler(ack, client, body);
  }

  private async handleEmailVerificationCode(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await this.viewSubmissionService.verificationCodeViewSubmissionHandler(ack, client, body);
  }
}
