import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, ConversationsOpenResponse } from '@slack/web-api';
import Redis from 'ioredis';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SlackActionIDEnum, SlackBlockIDEnum } from '../constant/slack.enum';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { Block } from '@slack/bolt';
import { LottoInfoInterface } from '../../interface/lotto.interface';

@Injectable()
export class ViewSubmissionService {
  constructor(
    public readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    private readonly slackRepository: SlackRepository,
    private readonly builderService: BuilderService
  ) {}

  async prizeInfoViewSubmissionHandler(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 최신 로또 회차 번호와 입력한 로또 회차 번호를 가져옵니다.
    const recentlyDrwNo: number = Number(await this.redis.get('drwNo'));
    const drwNo: number = Number(
      body.view.state.values[SlackBlockIDEnum.ORDER_INPUT][SlackActionIDEnum.ORDER_INPUT].value
    );
    // 유효성 검사를 진행합니다.
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
        view_id: body.view.id,
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

  async feedbackViewSubmissionHandler(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 유저 정보를 가져옵니다.
    const userId: string = body.user.id;
    const teamId: string = body.team.id;
    // 구독 해제 상태를 저장합니다.
    const userIdx = await this.slackRepository.upsertSubscribeStatus(teamId, userId, false, new Date());
    // 구독 해제 메시지를 작성합니다.
    let text: string = `<@${userId}>님, 구독 해제되었습니다. 🍀LOTTERY는 항상 더 나은 서비스가 되도록 노력하겠습니다.`;
    // 피드백이 있을 경우 저장합니다.
    const feedback: string =
      body.view.state.values[SlackBlockIDEnum.FEEDBACK_INPUT][SlackActionIDEnum.FEEDBACK_INPUT].value;

    if (feedback) {
      await this.slackRepository.insertFeedback(userIdx, feedback);

      text += ' (소중한 피드백 감사합니다. 👍)';
    }
    // View를 업데이트합니다. (모달 창 닫기)
    await ack();
    // 유저와 앱 간의 개인 채널을 엽니다.
    const response: ConversationsOpenResponse = await client.conversations.open({
      users: userId,
    });
    // 채널에 메시지를 발송합니다.
    await client.chat.postMessage({
      channel: response.channel.id,
      text,
    });
  }
}
