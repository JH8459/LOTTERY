import { Injectable } from '@nestjs/common';
import { Block, KnownBlock } from '@slack/bolt';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from 'src/common/interface/lotto.interface';
import { convertDateFormat, convertKRLocaleStringFormat, convertKoreanStringFormat } from 'src/common/utils/utils';
import { SlackActionIDEnum, SlackBlockIDEnum } from '../constant/slack.enum';
import { SpeettoInfoInterface } from '../../../../common/interface/speetto.interface';
import { RedisService } from 'src/module/redis/redis.service';
import { UserInfoDto } from '../dto/user.dto';
import { SUBSCRIBE_TYPE } from 'src/common/constant/enum';

@Injectable()
export class BuilderService {
  constructor(private readonly redisService: RedisService) {}

  async getLottoDrwnoPrizeInfoBlock(lottoInfo?: LottoInfoInterface): Promise<(Block | KnownBlock)[]> {
    if (!lottoInfo) {
      lottoInfo = await this.redisService.getRecentlyLottoInfo();
    }

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
        type: 'context',
        elements: [
          {
            text: '*당첨 결과는 3등까지의 정보만 제공합니다.*',
            type: 'mrkdwn',
          },
        ],
      },
    ];

    return block;
  }

  async getLottoPrizeInfoBlock(recentlyDrwNo: number): Promise<(Block | KnownBlock)[]> {
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
          image_url: 'https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_lotto.png',
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
          text: '*당첨 정보를 조회할 카테고리를 선택해주세요.*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*📊 당첨 결과 통계 조회*\n최다 당첨 번호와 최대 당첨 금액 정보를 조회합니다.',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '선택',
          },
          action_id: SlackActionIDEnum.STATISTIC_PRIZE_INFO,
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

  async getSpeettoPrizeInputBlock(): Promise<(Block | KnownBlock)[]> {
    const blocks: (Block | KnownBlock)[] = [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          emoji: true,
          text: '스피또 판매 정보 조회를 위해 복권 정보를 선택해주세요.',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*<https://dhlottery.co.kr/gameResult.do?method=speettoWin|동행복권 바로가기>* 즉석식 인쇄복권(스피또)은 동전 등으로 긁어 아주 쉽고, 빠르게 당첨 확인이 가능하고 게임도 함께 즐길 수 있는 인쇄복권입니다. 판매금액에 따라 *스피또500* / *스피또1000* / *스피또2000* 3종류의 복권이 있습니다.',
        },
        accessory: {
          type: 'image',
          image_url: 'https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_speetto.png',
          alt_text: 'speetto thumbnail',
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
            text: '*판매점 입고율은 매주 금요일 오전에 업데이트되니 이점 참고해주세요.*',
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
          text: ' ',
        },
      },
      {
        type: 'input',
        block_id: SlackBlockIDEnum.SPEETTO_INPUT,
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: '복권 종류를 선택해주세요.',
            emoji: true,
          },
          options: [
            {
              text: {
                type: 'plain_text',
                text: '1️⃣ 스피또 500',
                emoji: true,
              },
              value: '500',
            },
            {
              text: {
                type: 'plain_text',
                text: '2️⃣ 스피또 1000',
                emoji: true,
              },
              value: '1000',
            },
            {
              text: {
                type: 'plain_text',
                text: '3️⃣ 스피또 2000',
                emoji: true,
              },
              value: '2000',
            },
          ],
          action_id: SlackActionIDEnum.SPEETTO_INPUT,
        },
        label: {
          type: 'plain_text',
          text: '🍀 스피또 판매 정보 조회를 위해 복권 정보를 선택해주세요.',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'image',
            image_url: 'https://jh8459.s3.ap-northeast-2.amazonaws.com/slack/slack_info.png',
            alt_text: 'notifications information icon',
          },
          {
            type: 'mrkdwn',
            text: '*당첨 금액, 당첨 등수별 남은 매수, 판매점 입고율 정보를 제공합니다.*',
          },
        ],
      },
    ];

    return blocks;
  }

  async getSpeettoPrizeInfoBlock(speettoInfo: SpeettoInfoInterface): Promise<(Block | KnownBlock)[]> {
    const block: (Block | KnownBlock)[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🍀 스피또${speettoInfo.speettoType} ${convertKRLocaleStringFormat(speettoInfo.drwNo)}회 정보`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🏆 등수 별 정보',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            text: '*(당첨 금액 / 잔여 매수 / 기준 일자)*',
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
                    text: `🥇: ${speettoInfo.firstWinAmnt} / ${convertKRLocaleStringFormat(
                      speettoInfo.firstWinCnt
                    )}매 / ${convertDateFormat(speettoInfo.firstPrizeDate)}`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥈: ${speettoInfo.secondWinAmnt} / ${convertKRLocaleStringFormat(
                      speettoInfo.secondWinCnt
                    )}매 / ${convertDateFormat(speettoInfo.secondPrizeDate)}`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥉: ${speettoInfo.thirdWinAmnt} / ${convertKRLocaleStringFormat(
                      speettoInfo.thirdWinCnt
                    )}매 / ${convertDateFormat(speettoInfo.thirdPrizeDate)}`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            text: '*당첨 결과는 3등까지의 정보만 제공합니다.*',
            type: 'mrkdwn',
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🔍 판매점 입고율 정보',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            text: '*(판매점 입고율 = 판매점 입고량 / 발행량)*',
            type: 'mrkdwn',
          },
        ],
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
                    text: `${speettoInfo.saleRate}% `,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: 'text',
                    text: `(${convertDateFormat(speettoInfo.saleDate)} 기준)`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '*상기 정보는 참고를 위한 자료로 활용해주세요. 오류가 발생하거나 지연될 수 있습니다.*',
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
            text: ':pushpin: 궁금하신 사항이 있으신가요? *<https://lottery.jh8459.com/support.html|게시글>* 을 남겨주시면 답변드리겠습니다.',
          },
        ],
      },
    ];

    return block;
  }

  async getLottoStatisticPrizeInfoBlock(): Promise<(Block | KnownBlock)[]> {
    const lottoStatisticInfo: LottoStatisticInfoInterface = await this.redisService.getRecentlyLottoStatisticInfo();

    const lottoHighestPrizeInfo: LottoHighestPrizeInfoInterface =
      await this.redisService.getRecentlyLottoHighestPrizeInfo();

    const blocks: (Block | KnownBlock)[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📊 당첨 결과 통계 정보',
        },
      },
      {
        type: 'context',
        elements: [
          {
            text: '*최다 당첨 번호와 최대 당첨 금액 정보를 조회합니다.*',
            type: 'mrkdwn',
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
          text: '🔢 최다 당첨 번호 정보',
          emoji: true,
        },
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
                    text: `🥇 ${lottoStatisticInfo.firstLottoNo}번 `,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: 'text',
                    text: `(${convertKRLocaleStringFormat(lottoStatisticInfo.firstLottoNoCnt)}회)`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥈 ${lottoStatisticInfo.secondLottoNo}번 `,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: 'text',
                    text: `(${convertKRLocaleStringFormat(lottoStatisticInfo.secondLottoNoCnt)}회)`,
                  },
                ],
              },
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `🥉 ${lottoStatisticInfo.thirdLottoNo}번 `,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: 'text',
                    text: `(${convertKRLocaleStringFormat(lottoStatisticInfo.thirdLottoNoCnt)}회)`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            text: '*☘️ 보너스 번호를 포함한 통계입니다.*',
            type: 'mrkdwn',
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
          text: '👑 최대 당첨 금액 정보',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            text: '*최근 2년간 최대 당첨 금액 정보만 제공합니다.*',
            type: 'mrkdwn',
          },
        ],
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'text',
                text: `📅 ${convertDateFormat(lottoHighestPrizeInfo.thisYearDrwNoDate)} 추첨`,
                style: {
                  bold: true,
                },
              },
            ],
          },
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `${convertKRLocaleStringFormat(lottoHighestPrizeInfo.thisYearDrwNo)}회 / `,
                  },
                  {
                    type: 'text',
                    text: `${convertKoreanStringFormat(lottoHighestPrizeInfo.thisYearFirstWinamnt)}원 / `,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: 'text',
                    text: `${convertKRLocaleStringFormat(lottoHighestPrizeInfo.thisYearFirstPrzwnerCo)}명`,
                  },
                ],
              },
            ],
          },
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'text',
                text: `📅 ${convertDateFormat(lottoHighestPrizeInfo.lastYearDrwNoDate)} 추첨`,
                style: {
                  bold: true,
                },
              },
            ],
          },
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `${convertKRLocaleStringFormat(lottoHighestPrizeInfo.lastYearDrwNo)}회 / `,
                  },
                  {
                    type: 'text',
                    text: `${convertKoreanStringFormat(lottoHighestPrizeInfo.lastYearFirstWinamnt)}원 / `,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: 'text',
                    text: `${convertKRLocaleStringFormat(lottoHighestPrizeInfo.lastYearFirstPrzwnerCo)}명`,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    return blocks;
  }

  getSubscribeInputBlock(userInfo: UserInfoDto): (Block | KnownBlock)[] {
    const convertSlackSubscribeBlock = (userInfo: UserInfoDto) => {
      if (userInfo && userInfo.isSlackSubscribe) {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🔕 슬랙 구독 해지*\n<@${userInfo.userId}>님은 이미 구독중이시네요. 구독 해지를 원하시면 선택해주세요.`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '구독해지',
              emoji: true,
            },
            style: 'danger',
            action_id: SlackActionIDEnum.SLACK_UNSUBSCRIBE,
          },
        };
      } else {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*🔔 슬랙 구독하기*\n매주 월요일 AM 09:00에 워크스페이스의 앱 채널로 로또 당첨 정보를 요약해서 발송해드려요.',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '구독하기',
              emoji: true,
            },
            style: 'primary',
            action_id: SlackActionIDEnum.SLACK_SUBSCRIBE,
          },
        };
      }
    };

    const convertEmailSubscribeBlock = (userInfo: UserInfoDto) => {
      if (userInfo && userInfo.isEmailSubscribe) {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🔕 이메일 구독 해지*\n<@${userInfo.userId}>님은 이미 구독중이시네요. 구독 해지를 원하시면 선택해주세요.`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '구독해지',
              emoji: true,
            },
            style: 'danger',
            action_id: SlackActionIDEnum.EMAIL_UNSUBSCRIBE,
          },
        };
      } else {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*🔔 이메일 구독하기*\n매주 일요일 AM 09:00에 로또 당첨 정보가 담긴 뉴스레터를 발송해드려요.',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '구독하기',
              emoji: true,
            },
            style: 'primary',
            action_id: SlackActionIDEnum.EMAIL_SUBSCRIBE_INPUT,
          },
        };
      }
    };

    const blocks: (Block | KnownBlock)[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '구독 서비스들의 구독 상태를 확인 후 신청해주세요.',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🍀 LOTTERY* 는 두가지 방식 (*슬랙 앱 채널 알림*, *이메일 뉴스레터*) 의 구독 서비스를 지원합니다. 두가지 방식 모두 선택이 가능하니 원하시는 구독 서비스를 선택해주세요.',
        },
        accessory: {
          type: 'image',
          image_url: 'https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_subscribe.png',
          alt_text: 'subscribe',
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
            text: '*이메일이 수신이 안되시면 <https://lottery.jh8459.com/support.html|문의하기>* 게시판에 남겨주세요.',
          },
        ],
      },
      {
        type: 'divider',
      },
      convertSlackSubscribeBlock(userInfo),
      convertEmailSubscribeBlock(userInfo),
    ];

    return blocks;
  }

  getUnSubscribeConfirmedBlock(subscribeType: SUBSCRIBE_TYPE): (Block | KnownBlock)[] {
    const blocks: (Block | KnownBlock)[] = [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          emoji: true,
          text: '불편하신 점이 있으셨나요? 혹시 불편하신 점이 있었다면 소중한 피드백을 남겨주시면 큰 힘이 됩니다.',
        },
      },
      {
        type: 'input',
        block_id:
          subscribeType === SUBSCRIBE_TYPE.SLACK
            ? SlackBlockIDEnum.SLACK_FEEDBACK_INPUT
            : SlackBlockIDEnum.EMAIL_FEEDBACK_INPUT,
        element: {
          type: 'plain_text_input',
          action_id:
            subscribeType === SUBSCRIBE_TYPE.SLACK
              ? SlackActionIDEnum.SLACK_FEEDBACK_INPUT
              : SlackActionIDEnum.EMAIL_FEEDBACK_INPUT,
          multiline: true,
        },
        label: {
          type: 'plain_text',
          text: '불편 사항을 입력해주세요. (선택사항)',
        },
        optional: true,
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
            text: '*구독 해제를 원하시면 확인 버튼을 눌러주세요. 🥲*',
          },
        ],
      },
    ];

    return blocks;
  }

  getSubscribeEmailInputBlock(): (Block | KnownBlock)[] {
    const blocks: (Block | KnownBlock)[] = [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          emoji: true,
          text: '이메일 구독 신청은 메일 주소 확인 후 진행됩니다. ',
        },
      },
      {
        type: 'input',
        block_id: SlackBlockIDEnum.EMAIL_CONFIRM_INPUT,
        element: {
          type: 'plain_text_input',
          action_id: SlackActionIDEnum.EMAIL_CONFIRM_INPUT,
        },
        label: {
          type: 'plain_text',
          text: '정확한 이메일 주소를 입력해주세요.',
          emoji: true,
        },
        optional: false,
      },
      {
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
            text: '*메일 주소 변경은 구독 해지 후 다시 신청해주세요.*',
          },
        ],
      },
    ];

    return blocks;
  }
}
