import { WebClient, ConversationsOpenResponse, ChatPostMessageResponse } from '@slack/web-api';
import { UserInfoDto } from '../dto/user.dto';
import { SlackRepository } from '../repository/slack.repository';
import { BuilderService } from './builder.service';

export class SlackMessageService {
  constructor(private readonly slackRepository: SlackRepository, private readonly builderService: BuilderService) {}

  async sendSlackMessageToSubscriberList(userIdx: number): Promise<void> {
    const userInfo: UserInfoDto = await this.slackRepository.getUserInfoByIdx(userIdx);
    // 저장된 토큰을 가져와 클라이언트를 생성합니다.
    const token: string = await this.slackRepository.getAccessToken(userInfo.workspaceId);
    const client: WebClient = new WebClient(token);
    // 유저와 앱 간의 개인 채널을 엽니다.
    const response: ConversationsOpenResponse = await client.conversations.open({
      users: userInfo.userId,
    });
    // 채널에 메시지를 발송합니다.
    const postMessageResult: ChatPostMessageResponse = await client.chat.postMessage({
      channel: response.channel.id,
      text: `<@${userInfo.userId}>님, 이번 주 최신 당첨 결과 정보입니다. 🍀 (역대 통계 정보는 댓글로 따로 전달해드렸습니다! 🙌)`,
      blocks: [...(await this.builderService.getDrwnoPrizeInfoBlock())],
    });
    // 메시지의 thread를 생성합니다.
    const threadTs: string = postMessageResult.ts;

    await client.chat.postMessage({
      channel: response.channel.id,
      blocks: [...(await this.builderService.getStatisticPrizeInfoBlock())],
      thread_ts: threadTs,
    });
  }
}
