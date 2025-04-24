import { Injectable } from '@nestjs/common';
import { SlackRepository } from '../repository/slack.repository';
import { WebClient } from '@slack/web-api';

@Injectable()
/**
 * @description: ClientService는 Slack API와의 통신을 위한 WebClient 인스턴스를 생성 기능을 제공합니다.
 * @constructor
 * @param {SlackRepository} slackRepository - SlackRepository 인스턴스입니다.
 */
export class ClientService {
  constructor(private readonly slackRepository: SlackRepository) {}

  /**
   * @description - 주어진 workspace id에 해당하는 Slack workspace의 access token을 사용하여 WebClient 인스턴스를 생성합니다.
   * @param {string} id - token을 가져올 workspace id
   * @returns - WebClient 인스턴스
   */
  async getWebClientById(id: string): Promise<WebClient> {
    const token = await this.slackRepository.getAccessToken(id);

    return new WebClient(token);
  }
}
