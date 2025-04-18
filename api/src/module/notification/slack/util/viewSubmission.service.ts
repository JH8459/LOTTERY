import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, ConversationsOpenResponse } from '@slack/web-api';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SlackActionIDEnum, SlackBlockIDEnum } from '../constant/slack.enum';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { Block } from '@slack/bolt';
import { LottoInfoInterface } from '../../../../common/interface/lotto.interface';
import { SpeettoInfoInterface } from '../../../../common/interface/speetto.interface';
import { RedisService } from 'src/module/redis/redis.service';
import { UserInfoDto } from '../dto/user.dto';
import { LOG_TYPE_ENUM, SUBSCRIBE_TYPE } from 'src/common/constant/enum';

@Injectable()
export class ViewSubmissionService {
  constructor(
    public readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly slackRepository: SlackRepository,
    private readonly builderService: BuilderService
  ) {}

  async lottoPrizeInfoViewSubmissionHandler(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 최신 로또 회차 번호와 입력한 로또 회차 번호를 가져옵니다.
    let recentlyDrwNo: number = await this.redisService.getRecentlyLottoDrwNo();

    if (!recentlyDrwNo) {
      // Redis에 저장된 최근 로또 회차 번호가 없을 경우, DB에서 조회합니다.
      recentlyDrwNo = await this.slackRepository.getRecentlyLottoDrwNo();
    }

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

      await ack({
        response_action: 'update',
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: `당첨 정보 조회 / ${convertKRLocaleStringFormat(lottoInfo.drwNo)}회`,
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: ' ',
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '뒤로가기',
                },
                action_id: SlackActionIDEnum.PRIZE_INFO,
              },
            },
            ...(await this.builderService.getLottoDrwnoPrizeInfoBlock(lottoInfo)),
          ],
          close: {
            type: 'plain_text',
            text: '닫기',
          },
        },
      });
    }
  }

  async speettoPrizeInfoViewSubmissionHandler(
    ack: any,
    client: WebClient,
    body: SlackInteractionPayload
  ): Promise<void> {
    // 스피또 정보를 가져옵니다.
    const speettoType: number = Number(
      body.view.state.values[SlackBlockIDEnum.SPEETTO_INPUT][SlackActionIDEnum.SPEETTO_INPUT].selected_option.value
    );

    // 최신 스피또 당첨 정보를 Redis에서 가져옵니다.
    let speettoInfo: SpeettoInfoInterface = await this.redisService.getRecentlySpettoInfo(speettoType);

    if (!speettoInfo) {
      // Redis에 저장된 스피또 정보가 없을 경우, DB에서 조회합니다.
      speettoInfo = await this.slackRepository.getSpeettoInfo(speettoType);
    }

    await ack({
      response_action: 'update',
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: `스피또 ${speettoType}`,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: ' ',
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '뒤로가기',
              },
              action_id: SlackActionIDEnum.SPEETTO_INFO,
            },
          },
          ...(await this.builderService.getSpeettoPrizeInfoBlock(speettoInfo)),
        ],
        close: {
          type: 'plain_text',
          text: '닫기',
        },
      },
    });
  }

  async slackFeedbackViewSubmissionHandler(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    const teamId: string = body.team.id;
    const userId: string = body.user.id;

    // 유저 정보를 가져옵니다.
    const userInfo: UserInfoDto = await this.slackRepository.getUserInfo(teamId, userId);
    let workspaceIdx: number;

    if (!userInfo) {
      workspaceIdx = await this.slackRepository.getWorkSpaceIdx(teamId);
    }

    // 정보를 업데이트합니다. (구독 해제)
    const userIdx = await this.slackRepository.upsertSubscribeStatus(
      userInfo,
      workspaceIdx,
      userId,
      SUBSCRIBE_TYPE.SLACK,
      false
    );

    // 슬랙 구독 해제 로그를 저장합니다.
    await this.slackRepository.saveUserlog(userIdx, LOG_TYPE_ENUM.SLACK_UNSUBSCRIBE);

    // 구독 해제 메시지를 작성합니다.
    let text = `<@${userId}>님, 구독 해제되었습니다. 🍀LOTTERY는 항상 더 나은 서비스가 되도록 노력하겠습니다.`;

    const feedback: string =
      body.view.state.values[SlackBlockIDEnum.SLACK_FEEDBACK_INPUT][SlackActionIDEnum.SLACK_FEEDBACK_INPUT].value;

    if (feedback) {
      // 피드백이 있을 경우 저장합니다.
      await this.slackRepository.saveUserlog(userIdx, LOG_TYPE_ENUM.FEEDBACK_INPUT, feedback);

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

  async emailConfirmViewSubmissionHandler(ack: any, client: WebClient, body: SlackInteractionPayload): Promise<void> {
    const userEmail: string =
      body.view.state.values[SlackBlockIDEnum.EMAIL_CONFIRM_INPUT][SlackActionIDEnum.EMAIL_CONFIRM_INPUT].value;

    // 유효성 검사를 진행합니다.
    const emailRegex = /^[^@]+@.+$/; // 최소한의 이메일 형식 검증

    if (!emailRegex.test(userEmail)) {
      const originalBlocks = body.view.blocks;
      const errorMessage = '⚠️ 이메일 형식이 올바르지 않습니다.';

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
        // EMAIL_CONFIRM_INPUT 블록의 인덱스를 찾습니다.
        const emailConfirmIndex = originalBlocks.findIndex(
          (block: Block) => block.block_id === SlackBlockIDEnum.EMAIL_CONFIRM_INPUT
        );

        // 에러 메시지 블록을 생성합니다.
        const errorBlock = {
          type: 'section',
          block_id: SlackBlockIDEnum.INPUT_ERROR_MESSAGE,
          text: {
            type: 'mrkdwn',
            text: errorMessage,
          },
        };

        // EMAIL_CONFIRM_INPUT 블록 뒤에 에러 메시지 블록을 삽입합니다.
        originalBlocks.splice(emailConfirmIndex + 1, 0, errorBlock);
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
      const originalBlocks = body.view.blocks;

      // EMAIL_CONFIRM_INPUT 블록의 인덱스를 찾습니다.
      const emailConfirmIndex = originalBlocks.findIndex(
        (block: Block) => block.block_id === SlackBlockIDEnum.EMAIL_CONFIRM_INPUT
      );

      // 기존 에러 메시지 블록의 인덱스를 찾습니다.
      const errorBlockIndex = originalBlocks.findIndex(
        (block: Block) => block.block_id === SlackBlockIDEnum.INPUT_ERROR_MESSAGE
      );

      // 에러 메시지 블록이 존재하면 삭제합니다.
      if (errorBlockIndex !== -1) {
        originalBlocks.splice(errorBlockIndex, 1);
      }

      // EMAIL_CONFIRM_INPUT 블록을 읽기 전용 section 블록으로 대체합니다.
      originalBlocks[emailConfirmIndex] = {
        type: 'section',
        block_id: SlackBlockIDEnum.EMAIL_CONFIRM_INPUT,
        text: {
          type: 'mrkdwn',
          text: `*📧 이메일:* ${userEmail}`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '재전송',
            emoji: true,
          },
          action_id: SlackActionIDEnum.EMAIL_RESEND_VERIFICATION_CODE,
        },
      };

      // 6자리 인증번호 입력 블록을 추가합니다.
      const verificationInputBlock = {
        type: 'input',
        block_id: SlackBlockIDEnum.EMAIL_RESEND_VERIFICATION_CODE,
        element: {
          type: 'plain_text_input',
          action_id: SlackActionIDEnum.EMAIL_RESEND_VERIFICATION_CODE,
          placeholder: {
            type: 'plain_text',
            text: '6자리 인증번호를 입력하세요',
          },
          max_length: 6,
        },
        label: {
          type: 'plain_text',
          text: '인증번호 입력',
          emoji: true,
        },
      };

      // 인증번호 입력 블록을 EMAIL_CONFIRM_INPUT 블록 아래에 추가합니다.
      originalBlocks.splice(emailConfirmIndex + 1, 0, verificationInputBlock);

      // View를 업데이트합니다.
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
    }
  }
}
