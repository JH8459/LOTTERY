import { WebClient, ConversationsOpenResponse, ChatPostMessageResponse } from '@slack/web-api';
import { UserInfoDto } from '../dto/user.dto';
import { BuilderService } from './builder.service';
import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { UserSlackRepository } from '../repository/user.slack.repository';

@Injectable()
export class SlackMessageService {
  constructor(
    private readonly clientService: ClientService,
    private readonly builderService: BuilderService,
    private readonly userSlackRepository: UserSlackRepository
  ) {}

  async sendSlackMessageToSubscriberList(userIdx: number): Promise<void> {
    const userInfo: UserInfoDto = await this.userSlackRepository.getUserInfo({ userIdx });

    // 클라이언트를 생성합니다.
    const client: WebClient = await this.clientService.getWebClient(userInfo.workspaceId);

    // 유저와 앱 간의 개인 채널을 엽니다.
    const response: ConversationsOpenResponse = await client.conversations.open({
      users: userInfo.userId,
    });

    // 채널에 메시지를 발송합니다.
    await client.chat.postMessage({
      channel: response.channel.id,
      text: `<@${userInfo.userId}>님, 최신 로또 당첨 결과 정보입니다. 🍀 (통계 정보도 담아드렸으니 댓글 창을 열어 확인해주세요.)`,
    });

    const postMessageResult: ChatPostMessageResponse = await client.chat.postMessage({
      channel: response.channel.id,
      blocks: await this.builderService.getLottoDrwnoPrizeInfoBlock(),
    });

    // 메시지의 thread를 생성합니다.
    const threadTs: string = postMessageResult.ts;

    await client.chat.postMessage({
      channel: response.channel.id,
      text: `<@${userInfo.userId}>님, 로또 당첨 통계 정보는 아래와 같습니다. 당첨 통계일 뿐이니 참고 용도로만 활용해주세요. ☘️`,
      thread_ts: threadTs,
    });

    await client.chat.postMessage({
      channel: response.channel.id,
      blocks: await this.builderService.getLottoStatisticPrizeInfoBlock(),
      thread_ts: threadTs,
    });
  }
}
