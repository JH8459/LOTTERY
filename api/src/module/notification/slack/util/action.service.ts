import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SlackActionIDEnum, SlackSubMitButtonNameEnum } from '../constant/slack.enum';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { UserInfoDto } from '../dto/user.dto';
import { RedisService } from 'src/module/redis/redis.service';
import { LOG_TYPE_ENUM, SUBSCRIBE_TYPE } from 'src/common/constant/enum';

@Injectable()
export class ActionService {
  constructor(
    private readonly redisService: RedisService,
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
                text: ':pushpin: 궁금하신 사항이 있으신가요? *<https://lottery.jh8459.com/support.html|게시글>* 을 남겨주시면 답변드리겠습니다.',
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
                text: ':pushpin: 궁금하신 사항이 있으신가요? *<https://lottery.jh8459.com/support.html|게시글>* 을 남겨주시면 답변드리겠습니다.',
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
        blocks: await this.builderService.getSubscribeInputBlock(updateUserInfo),
        close: {
          type: 'plain_text',
          text: '닫기',
        },
      },
    });
  }

  async slackUnSubscribeActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 모달창 업데이트
    await client.views.update({
      view_id: body.view.id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '구독 취소 확인',
        },
        blocks: await this.builderService.getUnSubscribeConfirmedBlock(body.user.name),
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
}
