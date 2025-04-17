import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';
import { SlackInteractionPayload } from '../interface/payload.interface';
import { SlackActionIDEnum, SlackSubMitButtonNameEnum } from '../constant/slack.enum';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { UserInfoDto } from '../dto/user.dto';
import { RedisService } from 'src/module/redis/redis.service';
import { Transactional } from 'typeorm-transactional';
import { LOG_TYPE_ENUM } from 'src/common/constant/enum';

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

  @Transactional()
  async subscribeActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 유저의 정보를 조회합니다.
    const userId: string = body.user.id;
    const teamId: string = body.user.team_id;

    // 유저 정보를 가져옵니다.
    const userInfo: UserInfoDto = await this.slackRepository.getUserInfo(teamId, userId);
    let workspaceIdx: number;

    if (!userInfo) {
      workspaceIdx = await this.slackRepository.getWorkSpaceIdx(teamId);
    }

    let text: string;

    if (userInfo && userInfo.isSlackSubscribe) {
      text = `<@${userId}>님은 이미 구독중입니다. 구독 취소를 원하시면 '/구독' 명령어를 입력해주세요.`;
    } else {
      text = `<@${userId}>님, 구독해주셔서 감사합니다. 매주 월요일 09시에 당첨 결과 정보를 알려드릴게요. 🍀`;

      // 정보를 업데이트합니다. (구독)
      const userIdx = await this.slackRepository.upsertSubscribeStatus(userInfo, workspaceIdx, userId, false);

      // 슬랙 구독 로그를 저장합니다.
      await this.slackRepository.saveUserlog(userIdx, LOG_TYPE_ENUM.SLACK_SUBSCRIBE, userId);
    }

    await client.chat.postMessage({
      channel: body.channel.id,
      text,
    });
  }

  async unSubscribeActionHandler(client: WebClient, body: SlackInteractionPayload): Promise<void> {
    // 유저의 정보를 조회합니다.
    const userId: string = body.user.id;
    const teamId: string = body.user.team_id;

    const userInfo: UserInfoDto = await this.slackRepository.getUserInfo(teamId, userId);

    if (userInfo && userInfo.isSlackSubscribe) {
      // 모달을 출력합니다.
      await client.views.open({
        trigger_id: body.trigger_id,
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
    } else {
      await client.chat.postMessage({
        channel: body.channel.id,
        text: `<@${userId}>님은 이미 구독 해지 상태입니다. 구독을 다시 원하시면 '/구독' 명령어를 입력해주세요.`,
      });
    }
  }
}
