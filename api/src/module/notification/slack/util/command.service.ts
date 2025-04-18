import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';
import { WebClient, ConversationsOpenResponse } from '@slack/web-api';
import { SlashCommand } from '@slack/bolt';
import { UserInfoDto } from '../dto/user.dto';
import { SlackSubMitButtonNameEnum } from '../constant/slack.enum';
import { RedisService } from 'src/module/redis/redis.service';
import { ClientService } from './client.service';

@Injectable()
export class CommandService {
  constructor(
    public readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly slackRepository: SlackRepository,
    private readonly builderService: BuilderService,
    private readonly clientService: ClientService
  ) {}

  async lottoPrizeInfoCommandHandler(command: SlashCommand): Promise<void> {
    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClientById(command.team_id);

    // 최신 로또 회차 정보를 가져옵니다.
    let recentlyLottoDrwNo: number = await this.redisService.getRecentlyLottoDrwNo();

    if (!recentlyLottoDrwNo) {
      // Redis에 저장된 최근 로또 회차 번호가 없을 경우, DB에서 조회합니다.
      recentlyLottoDrwNo = await this.slackRepository.getRecentlyLottoDrwNo();
    }

    // 모달을 출력합니다.
    await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '로또 당첨 정보 조회',
        },
        blocks: await this.builderService.getLottoPrizeInfoBlock(recentlyLottoDrwNo),
        close: {
          type: 'plain_text',
          text: '닫기',
        },
        submit: {
          type: 'plain_text',
          text: '조회',
        },
      },
    });
  }

  async speettoPrizeInfoCommandHandler(command: SlashCommand): Promise<void> {
    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClientById(command.team_id);

    // 모달을 출력합니다.
    await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '스피또 당첨 정보 조회',
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

  async subscribeCommandHandler(command: SlashCommand): Promise<void> {
    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClientById(command.team_id);

    const userId: string = command.user_id;
    const teamId: string = command.team_id;

    // // 유저와 앱 간의 개인 채널을 엽니다.
    // const response: ConversationsOpenResponse = await client.conversations.open({
    //   users: userId,
    // });

    // 유저의 정보를 조회합니다.
    const userInfo: UserInfoDto = await this.slackRepository.getUserInfo(teamId, userId);

    // 모달을 출력합니다.
    await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: '구독 서비스 관리',
        },
        blocks: await this.builderService.getSubscribeInputBlock(userInfo),
        close: {
          type: 'plain_text',
          text: '닫기',
        },
      },
    });

    // if (userInfo && userInfo.isSlackSubscribe) {
    //   // 유저의 앱 채널에서 구독 취소 메시지를 발송합니다.
    //   await client.chat.postMessage({
    //     channel: response.channel.id,
    //     blocks: await this.builderService.getUnSubscribeInfoBlock(userId),
    //   });
    // } else {
    //   // 유저의 앱 채널에서 구독 신청 메시지를 발송합니다.
    //   await client.chat.postMessage({
    //     channel: response.channel.id,
    //     blocks: await this.builderService.getSubscribeInfoBlock(userId),
    //   });
    // }
  }
}
