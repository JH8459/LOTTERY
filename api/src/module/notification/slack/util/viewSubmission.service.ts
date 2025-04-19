import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, ConversationsOpenResponse, ModalView } from '@slack/web-api';
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
import { EmailService } from '../../email/email.service';

@Injectable()
export class ViewSubmissionService {
  constructor(
    public readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
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

    const emailRegex = /^[^@]+@.+$/;
    const originalBlocks = [...body.view.blocks]; // 원본 복사 (불변성 확보)

    const updateView = async (updatedBlocks: Block[]): Promise<void> => {
      const viewPayload: ModalView = {
        type: 'modal',
        title: body.view.title,
        blocks: updatedBlocks,
        close: body.view.close,
        submit: body.view.submit,
      };

      await client.views.update({
        view_id: body.view.id,
        view: viewPayload,
      });

      await ack({
        response_action: 'update',
        view: viewPayload,
      });
    };

    const findBlockIndex = (blockId: string) => originalBlocks.findIndex((block: Block) => block.block_id === blockId);

    // ✅ 이메일 유효성 검사 실패 시
    if (!emailRegex.test(userEmail)) {
      const errorMessageBlock = {
        type: 'section',
        block_id: SlackBlockIDEnum.INPUT_ERROR_MESSAGE,
        text: {
          type: 'mrkdwn',
          text: '⚠️ 이메일 형식이 올바르지 않습니다.',
        },
      };

      const errorIndex = findBlockIndex(SlackBlockIDEnum.INPUT_ERROR_MESSAGE);
      const emailInputIndex = findBlockIndex(SlackBlockIDEnum.EMAIL_CONFIRM_INPUT);

      if (errorIndex !== -1) {
        originalBlocks[errorIndex] = errorMessageBlock;
      } else if (emailInputIndex !== -1) {
        originalBlocks.splice(emailInputIndex + 1, 0, errorMessageBlock);
      }

      return await updateView(originalBlocks);
    }

    // ✅ 유효한 이메일일 경우
    // 기존 에러 메시지 블록 제거
    const errorIndex = findBlockIndex(SlackBlockIDEnum.INPUT_ERROR_MESSAGE);
    if (errorIndex !== -1) originalBlocks.splice(errorIndex, 1);

    const emailInputIndex = findBlockIndex(SlackBlockIDEnum.EMAIL_CONFIRM_INPUT);
    if (emailInputIndex !== -1) {
      originalBlocks[emailInputIndex] = {
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
    }

    // Redis에서 인증코드 가져오기
    const verificationCode: string = await this.redisService.getVerificationCode(userEmail, 60 * 60);

    // 이메일 발송
    await this.emailService.enqueueVerificationCodeEmail(userEmail, verificationCode);

    // 인증코드 입력 블록 삽입
    const verificationInputBlock = {
      type: 'input',
      block_id: SlackBlockIDEnum.EMAIL_RESEND_VERIFICATION_CODE,
      element: {
        type: 'plain_text_input',
        action_id: SlackActionIDEnum.EMAIL_RESEND_VERIFICATION_CODE,
        placeholder: {
          type: 'plain_text',
          text: '6자리 인증코드를 입력하세요',
        },
        max_length: 6,
      },
      label: {
        type: 'plain_text',
        text: '인증코드 입력',
        emoji: true,
      },
    };

    // 삽입 위치 조정 (중복 방지)
    const existingCodeInputIndex = findBlockIndex(SlackBlockIDEnum.EMAIL_RESEND_VERIFICATION_CODE);

    if (existingCodeInputIndex !== -1) {
      originalBlocks[existingCodeInputIndex] = verificationInputBlock;
    } else {
      originalBlocks.splice(emailInputIndex + 1, 0, verificationInputBlock);
    }

    // 경고 메시지 블록 삽입 또는 업데이트
    const warningBlock = {
      type: 'context',
      block_id: SlackBlockIDEnum.EMAIL_CONFIRM_INPUT_WARNING,
      elements: [
        {
          type: 'image',
          image_url: 'https://api.slack.com/img/blocks/bkb_template_images/notificationsWarningIcon.png',
          alt_text: 'notifications warning icon',
        },
        {
          type: 'mrkdwn',
          text: '*인증코드의 유효시간은 1시간입니다.*',
        },
      ],
    };

    const warningIndex = findBlockIndex(SlackBlockIDEnum.EMAIL_CONFIRM_INPUT_WARNING);

    if (warningIndex !== -1) {
      originalBlocks[warningIndex] = warningBlock;
    } else {
      originalBlocks.splice(emailInputIndex + 2, 0, warningBlock);
    }

    return await updateView(originalBlocks);
  }
}
