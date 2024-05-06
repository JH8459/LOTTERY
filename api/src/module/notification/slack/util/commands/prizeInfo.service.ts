import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { View } from '@slack/bolt';
import Redis from 'ioredis';
import { convertKRLocaleStringFormat } from 'src/common/utils/utils';
import { SlackRepository } from '../../repository/slack.repository';

@Injectable()
export class PrizeInfoService {
  constructor(@InjectRedis() private readonly redis: Redis, private slackRepository: SlackRepository) {}

  async getPrizeInfoModal(): Promise<View> {
    let recentlyDrwNo: number = Number(await this.redis.get('drwNo'));

    if (!recentlyDrwNo) {
      recentlyDrwNo = await this.slackRepository.getRecentlyDrwNo();
    }

    const modal: View = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: '당첨 정보 조회',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '로또 당첨 정보 조회를 위해 회차 정보를 선택해주세요.',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*<https://dhlottery.co.kr/|동행복권 바로가기>*\n로또 6/45의 추첨방송은 *매주 토요일 오후 8시 35분경* MBC방송국 스튜디오에서 생방송으로 진행되며, 추첨을 통해 당첨번호가 결정되고 그 결과를 확인하실 수 있습니다.',
          },
          accessory: {
            type: 'image',
            image_url: 'https://github.com/JH8459/LOTTERY/assets/83164003/bef55dc9-7eaf-4143-b778-1072d84151dd',
            alt_text: 'lotto thumbnail',
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url: 'https://api.slack.com/img/blocks/bkb_template_images/notificationsWarningIcon.png',
              alt_text: 'notifications warning icon',
            },
            {
              type: 'mrkdwn',
              text: '*LOTTERY는 매주 일요일 새벽 3시에 당첨 정보를 수집합니다.*',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*당첨 정보를 조회할 회차를 선택해주세요.*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🍀 이번 주 당첨 결과 조회*\n${convertKRLocaleStringFormat(
              recentlyDrwNo
            )}회 당첨 결과 정보를 가져옵니다.`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: '선택',
            },
            value: 'recently',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*☘️ 다른 회차 당첨 결과 조회*',
          },
        },
        {
          type: 'input',
          element: {
            type: 'plain_text_input',
            action_id: 'plain_text_input-action',
          },
          label: {
            type: 'plain_text',
            text: '조회 버튼을 눌러 입력한 회차의 당첨 결과 정보를 가져옵니다.',
            emoji: true,
          },
        },
      ],
      close: {
        type: 'plain_text',
        text: '닫기',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: '조회',
        emoji: true,
      },
    };

    return modal;
  }
}
