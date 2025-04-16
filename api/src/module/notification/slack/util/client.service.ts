import { Injectable } from '@nestjs/common';
import { SlackRepository } from '../repository/slack.repository';
import { WebClient } from '@slack/web-api';

@Injectable()
export class ClientService {
  constructor(private readonly slackRepository: SlackRepository) {}

  /**
   *
   * @param id - token을 가져올 workspace id
   * @returns - WebClient 인스턴스
   * @description - 주어진 workspace id에 해당하는 Slack workspace의 access token을 사용하여 WebClient 인스턴스를 생성합니다.
   */
  async getWebClientById(id: string): Promise<WebClient> {
    const token = await this.slackRepository.getAccessToken(id);

    return new WebClient(token);
  }
}
