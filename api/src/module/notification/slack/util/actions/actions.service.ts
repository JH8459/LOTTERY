import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Block, KnownBlock } from '@slack/bolt';
import Redis from 'ioredis';
import { SlackRepository } from '../../repository/slack.repository';
import { LottoInfoInterface } from 'src/module/notification/interface/lotto.interface';
import { convertDateFormat, convertKRLocaleStringFormat, convertKoreanStringFormat } from 'src/common/utils/utils';

@Injectable()
export class ActionsService {
  constructor(@InjectRedis() private readonly redis: Redis, private slackRepository: SlackRepository) {}

  async getPrizeInfoBlock(): Promise<(Block | KnownBlock)[]> {
    const lottoInfo: LottoInfoInterface = {
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

    const block: (Block | KnownBlock)[] = [
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
                    text: `1️⃣: ${lottoInfo.drwtNo1}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 2️⃣: ${lottoInfo.drwtNo2}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 3️⃣: ${lottoInfo.drwtNo3}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 4️⃣: ${lottoInfo.drwtNo4}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 5️⃣: ${lottoInfo.drwtNo5}번 `,
                  },
                  {
                    type: 'text',
                    text: `/ 6️⃣: ${lottoInfo.drwtNo6}번`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: '보너스 번호 ☘️: ',
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
}
