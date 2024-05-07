import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { SlackRepository } from '../../repository/slack.repository';
import { Block, KnownBlock } from '@slack/bolt';
import { LottoInfoInterface } from 'src/module/notification/interface/lotto.interface';
import { convertDateFormat, convertKRLocaleStringFormat, convertKoreanStringFormat } from 'src/common/utils/utils';
import { SlackActionIDEnum, SlackBlockIDEnum } from '../../constant/slack.enum';

@Injectable()
export class BuilderService {
  constructor(@InjectRedis() private readonly redis: Redis, private slackRepository: SlackRepository) {}

  async getDrwnoPrizeInfoBlock(lottoInfo?: LottoInfoInterface): Promise<(Block | KnownBlock)[]> {
    if (!lottoInfo) {
      lottoInfo = {
        drwNo: Number(await this.redis.get('drwNo')),
        drwtNo1: Number(await this.redis.get('drwtNo1')),
        drwtNo2: Number(await this.redis.get('drwtNo2')),
        drwtNo3: Number(await this.redis.get('drwtNo3')),
        drwtNo4: Number(await this.redis.get('drwtNo4')),
        drwtNo5: Number(await this.redis.get('drwtNo5')),
        drwtNo6: Number(await this.redis.get('drwtNo6')),
        bnusNo: Number(await this.redis.get('bnusNo')),
        firstWinamnt: Number(await this.redis.get('firstWinamnt')),
        firstPrzwnerCo: Number(await this.redis.get('firstPrzwnerCo')),
        secondWinamnt: Number(await this.redis.get('secondWinamnt')),
        secondPrzwnerCo: Number(await this.redis.get('secondPrzwnerCo')),
        thirdWinamnt: Number(await this.redis.get('thirdWinamnt')),
        thirdPrzwnerCo: Number(await this.redis.get('thirdPrzwnerCo')),
        drwNoDate: new Date(await this.redis.get('drwNoDate')),
      };
    }

    const block: (Block | KnownBlock)[] = [
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
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🍀 ${convertKRLocaleStringFormat(lottoInfo.drwNo)}회 당첨 결과 정보`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            text: `*${convertDateFormat(lottoInfo.drwNoDate)} 추첨*`,
            type: 'mrkdwn',
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `1️⃣ ${lottoInfo.drwtNo1}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 2️⃣ ${lottoInfo.drwtNo2}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 3️⃣ ${lottoInfo.drwtNo3}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 4️⃣ ${lottoInfo.drwtNo4}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 5️⃣ ${lottoInfo.drwtNo5}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 6️⃣ ${lottoInfo.drwtNo6}번`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: '보너스 번호 ☘️ ',
                  },
                  {
                    type: 'text',
                    text: `${lottoInfo.bnusNo}번`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🏆 등수 별 당첨 결과 정보',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            text: '*(당첨 인원 / 당첨 금액)*',
            type: 'mrkdwn',
          },
        ],
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'ordered',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥇: ${convertKRLocaleStringFormat(lottoInfo.firstPrzwnerCo)}명 / ${convertKoreanStringFormat(
                      lottoInfo.firstWinamnt
                    )}원`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥈: ${convertKRLocaleStringFormat(
                      lottoInfo.secondPrzwnerCo
                    )}명 / ${convertKoreanStringFormat(lottoInfo.secondWinamnt)}원`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥉: ${convertKRLocaleStringFormat(lottoInfo.thirdPrzwnerCo)}명 / ${convertKoreanStringFormat(
                      lottoInfo.thirdWinamnt
                    )}원`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ':pushpin: 궁금하신 사항이 있으신가요? *<https://github.com/JH8459/LOTTERY/issues|Github ISSUE>* 를 남겨주시면 답변드리겠습니다.',
          },
        ],
      },
    ];

    return block;
  }

  async getPrizeInfoBlock(recentlyDrwNo: number): Promise<(Block | KnownBlock)[]> {
    const blocks: (Block | KnownBlock)[] = [
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
          text: `*🍀 최신 당첨 결과 조회*\n${convertKRLocaleStringFormat(
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
          value: `${recentlyDrwNo}`,
          action_id: SlackActionIDEnum.RECENTLY_PRIZE_INFO,
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
        block_id: SlackBlockIDEnum.ORDER_INPUT,
        element: {
          type: 'plain_text_input',
          action_id: SlackActionIDEnum.ORDER_INPUT,
        },
        label: {
          type: 'plain_text',
          text: '조회 버튼을 눌러 입력한 회차의 당첨 결과 정보를 가져옵니다.',
        },
      },
    ];

    return blocks;
  }
}
