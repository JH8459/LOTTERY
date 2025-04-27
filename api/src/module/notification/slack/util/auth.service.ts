import { Injectable } from '@nestjs/common';
import { SlackRepository } from '../repository/slack.repository';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { CustomLoggerService } from 'src/module/logger/logger.service';
import { CustomInternalServerErrorException } from 'src/common/custom/exception/exception.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SlackOAuthResponse, SlackTeamResponse } from '../interface/response.interface';

@Injectable()
/**
 * @description: AuthService Slack API와의 통신을 위한 Auth 관련 기능을 제공합니다.
 * @constructor
 * @param {ConfigService} configService - NestJS ConfigService 인스턴스입니다.
 * @param {HttpService} httpService - NestJS HttpService 인스턴스입니다.
 * @param {CustomLoggerService} loggerService - CustomLoggerService 인스턴스입니다.
 * @param {SlackRepository} slackRepository - SlackRepository 인스턴스입니다.
 * @property {string} API_SLACK_CLIENT_ID - Slack Client ID입니다.
 * @property {string} API_SLACK_CLIENT_SECRET - Slack Client Secret입니다.
 */
export class AuthService {
  private readonly API_SLACK_CLIENT_ID: string;
  private readonly API_SLACK_CLIENT_SECRET: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: CustomLoggerService,
    private readonly slackRepository: SlackRepository
  ) {
    this.API_SLACK_CLIENT_ID = this.configService.get<string>('API_SLACK_CLIENT_ID');
    this.API_SLACK_CLIENT_SECRET = this.configService.get<string>('API_SLACK_CLIENT_SECRET');
  }
  /**
   * @description - 주어진 code를 사용하여 워크스페이스에 대한 Slack 인증 절차를 수행하고 accessToken과 워크스페이스 정보를 DB에 저장합니다.
   * @param {string} code - Slack OAuth 인증 코드입니다.
   * @returns {Promise<string>} - Redirect URL
   * @throws - 인증 실패 시 'https://slack.com'으로 Redirect
   */
  async authorizeSlackCode(code: string): Promise<string> {
    try {
      const oAuthResponseInfo: SlackOAuthResponse = await this.fetchOAuthInfo(code);
      const teamResponseInfo: SlackTeamResponse = await this.fetchTeamInfo(oAuthResponseInfo);

      // accessToken과 팀 워크스페이스 정보를 DB에 저장
      await this.slackRepository.saveAccessToken(
        teamResponseInfo.workspaceName,
        teamResponseInfo.workspaceId,
        oAuthResponseInfo.accessToken
      );

      return teamResponseInfo.appRedirectUrl;
    } catch (error) {
      this.loggerService.error('Slack OAuth 인증 중 문제가 발생했습니다.', error);

      return 'https://slack.com';
    }
  }

  /**
   * @description - 주어진 code를 사용하여 Slack API에서 accessToken과 appId를 가져와 SlackOAuthResponse 객체를 반환합니다.
   * @param {string} code - Slack Auth 인증 코드
   * @returns {Promise<SlackOAuthResponse | null>} - 인증 성공 시 SlackOAuthResponse 반환
   * @throws - 인증 실패 시 null 반환
   */
  private async fetchOAuthInfo(code: string): Promise<SlackOAuthResponse | null> {
    try {
      const payload: string = new URLSearchParams({
        client_id: this.API_SLACK_CLIENT_ID,
        client_secret: this.API_SLACK_CLIENT_SECRET,
        code,
      }).toString();

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post('https://slack.com/api/oauth.v2.access', payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      if (!response.data.ok) {
        return null;
      }

      const accessToken: string = response.data.access_token;
      const appId: string = response.data.app_id;

      return {
        accessToken,
        appId,
      };
    } catch (error) {
      throw new CustomInternalServerErrorException('Slack OAuth 인증 중 문제가 발생했습니다.');
    }
  }

  /**
   * @description - 주어진 accessToken을 사용하여 Slack API에서 팀 정보를 가져와 SlackTeamResponse 객체를 반환합니다.
   * @param {SlackOAuthResponse} oAuthResponseInfo
   * @returns {Promise<SlackTeamResponse | null>} - 인증 성공 시 SlackTeamResponse 반환
   * @throws - 인증 실패 시 null 반환
   */
  private async fetchTeamInfo({ accessToken, appId }: SlackOAuthResponse): Promise<SlackTeamResponse | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://slack.com/api/team.info', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      if (!response.data.ok) {
        return null;
      }

      const workspaceId: string = response.data.team.id;
      const workspaceName: string = response.data.team.name;
      const appRedirectUrl: string = `https://${response.data.team.domain}.slack.com/app_redirect?app=${appId}`;

      return {
        workspaceId,
        workspaceName,
        appRedirectUrl,
      };
    } catch (error) {
      throw new CustomInternalServerErrorException('워크스페이스 정보를 가져오지 못했습니다.');
    }
  }
}
