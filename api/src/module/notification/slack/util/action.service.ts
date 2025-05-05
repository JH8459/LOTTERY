import { Injectable } from '@nestjs/common';
import { Block, WebClient } from '@slack/web-api';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SlackActionIDEnum, SlackBlockIDEnum, SlackSubMitButtonNameEnum } from '../constant/slack.enum';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { UserInfoDto } from '../dto/user.dto';
import { RedisService } from 'src/module/redis/redis.service';
import { LOG_TYPE_ENUM, SUBSCRIBE_TYPE } from 'src/common/constant/enum';
import { EmailService } from '../../email/email.service';

@Injectable()
export class ActionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly slackRepository: SlackRepository,
    private readonly builderService: BuilderService
  ) {}

  async prizeInfoActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    let recentlyDrwNo: number = await this.redisService.getRecentlyLottoDrwNo();

    if (!recentlyDrwNo) {
      // Redis에 저장된 최근 로또 회차 번호가 없을 경우, DB에서 조회합니다.
      recentlyDrwNo = await this.slackRepository.getRecentlyLottoDrwNo();
    }

    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '당첨 정보 조회',
        },
        blocks: await this.builderService.getLottoPrizeInfoBlock(recentlyDrwNo),
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
  }

  async recentlyPrizeInfoActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    let recentlyDrwNo: number = await this.redisService.getRecentlyLottoDrwNo();

    if (!recentlyDrwNo) {
      // Redis에 저장된 최근 로또 회차 번호가 없을 경우, DB에서 조회합니다.
      recentlyDrwNo = await this.slackRepository.getRecentlyLottoDrwNo();
    }

    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: `당첨 정보 조회 / ${convertKRLocaleStringFormat(recentlyDrwNo)}회`,
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
          ...(await this.builderService.getLottoDrwnoPrizeInfoBlock()),
          {
            type: 'divider',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: ':pushpin: 궁금하신 사항이 있으신가요? *<https://lottery.jh8459.com/support|게시글>* 을 남겨주시면 답변드리겠습니다.',
              },
            ],
          },
        ],
        close: {
          type: 'plain_text',
          text: '닫기',
        },
      },
    });
  }

  async statisticPrizeInfoActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: `당첨 정보 조회 / 통계 조회`,
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
          ...(await this.builderService.getLottoStatisticPrizeInfoBlock()),
          {
            type: 'divider',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: ':pushpin: 궁금하신 사항이 있으신가요? *<https://lottery.jh8459.com/support|게시글>* 을 남겨주시면 답변드리겠습니다.',
              },
            ],
          },
        ],
        close: {
          type: 'plain_text',
          text: '닫기',
        },
      },
    });
  }

  async speettoInfoActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '당첨 정보 조회',
        },
        blocks: await this.builderService.getSpeettoPrizeInputBlock(),
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
  }

  async slackSubscribeActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    const userId: string = body.user.id;
    const teamId: string = body.user.team_id;

    // 유저 정보를 조회합니다.
    const userInfo: UserInfoDto = await this.slackRepository.getUserInfo(teamId, userId);
    let workspaceIdx: number;

    if (!userInfo) {
      workspaceIdx = await this.slackRepository.getWorkSpaceIdx(teamId);
    }

    // 유저 정보를 업데이트합니다. (슬랙 서비스 구독)
    const userIdx = await this.slackRepository.upsertSubscribeStatus(
      userInfo,
      workspaceIdx,
      userId,
      SUBSCRIBE_TYPE.SLACK,
      true
    );

    // 유저 로그를 저장합니다.
    await this.slackRepository.saveUserlog(userIdx, LOG_TYPE_ENUM.SLACK_SUBSCRIBE);

    // 유저 정보를 재조회합니다.
    const updateUserInfo: UserInfoDto = await this.slackRepository.getUserInfo(teamId, userId);

    // 모달창 업데이트
    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '구독 서비스 관리',
        },
        blocks: this.builderService.getSubscribeInputBlock(updateUserInfo),
        close: {
          type: 'plain_text',
          text: '닫기',
        },
      },
    });
  }

  async unSubscribeActionHandler(
    client: WebClient,
    body: SlackInteractionPayload,
    subscribeType: SUBSCRIBE_TYPE
  ): Promise<void> {
    // 모달창 업데이트
    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '구독 취소 확인',
        },
        blocks: this.builderService.getUnSubscribeConfirmedBlock(subscribeType),
        close: {
          type: 'plain_text',
          text: '닫기',
        },
        submit: {
          type: 'plain_text',
          text: '확인',
        },
      },
    });
  }

  async emailSubscribeInputActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 모달창 업데이트
    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '이메일 주소 확인',
        },
        blocks: this.builderService.getSubscribeEmailInputBlock(),
        close: {
          type: 'plain_text',
          text: '닫기',
        },
        submit: {
          type: 'plain_text',
          text: '확인',
        },
      },
    });
  }

  async emailResendVerificationCodeActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // block_id가 'email_confirm_input'인 블록을 찾습니다.
    const emailBlock = body.view.blocks.find((block) => block.block_id === SlackBlockIDEnum.EMAIL_CONFIRM_INPUT);

    // 이메일 값을 추출합니다.
    const emailRegex = /<mailto:(.*?)\|/; // 이메일 추출을 위한 정규식
    const match = emailBlock['text']['text'].match(emailRegex);
    const userEmail = match ? match[1] : null;

    const originalBlocks = body.view.blocks;

    // EMAIL_CONFIRM_INPUT 블록의 인덱스를 찾습니다.
    const emailConfirmIndex = originalBlocks.findIndex(
      (block: Block) => block.block_id === SlackBlockIDEnum.EMAIL_CONFIRM_INPUT
    );

    originalBlocks[emailConfirmIndex] = {
      type: 'section',
      block_id: SlackBlockIDEnum.EMAIL_CONFIRM_INPUT,
      text: {
        type: 'mrkdwn',
        text: `*📧 이메일:* ${userEmail} ✅ 재전송 완료`,
      },
    };

    // EMAIL_CONFIRM_INPUT 블록 아래에 문구를 삽입합니다.
    const resendCommentBlock = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '메일 재전송은 1회만 가능합니다.\n다시 시도하시려면 이메일 구독을 다시 신청해주세요.',
      },
    };

    originalBlocks.splice(emailConfirmIndex + 1, 0, resendCommentBlock);

    // Redis에서 6자리 인증코드를 가져옵니다. (유효시간: 1시간)
    const verificationCode: string = await this.redisService.setVerificationCode(userEmail, 60 * 60);

    // 인증코드 이메일을 발송합니다.
    await this.emailService.enqueueVerificationCodeEmail(userEmail, verificationCode);

    // 모달창 업데이트
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
  }
}
