import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AppModule } from 'src/module/app.module';
import { SlackService } from 'src/module/notification/slack/slack.service';
import { SlackRepository } from 'src/module/notification/slack/repository/slack.repository';

describe('SlackController E2E - /slack/auth', () => {
  let app: INestApplication;
  let httpService: HttpService;
  let slackService: SlackService;
  let slackRepository: SlackRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpService = moduleFixture.get<HttpService>(HttpService);
    slackService = moduleFixture.get<SlackService>(SlackService);
    slackRepository = moduleFixture.get<SlackRepository>(SlackRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('✅ authorizeSlackCode - auth.service.ts의 fetchOAuthInfo, fetchTeamInfo 메서드가 모두 성공시 의도한 accessToken을 저장하고 Redirect URL을 반환하는가?', async () => {
    const mockAccessToken = 'fake-access-token';
    const mockAppId = 'fake-app-id';
    const mockTeamId = 'fake-team-id';
    const mockTeamName = 'fake-team-name';
    const mockTeamDomain = 'fake-domain';

    // 1. Slack OAuth Access Token API Mock
    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of({
        data: {
          ok: true,
          access_token: mockAccessToken,
          app_id: mockAppId,
        },
      } as AxiosResponse)
    );

    // 2. Slack Team Info API Mock
    jest.spyOn(httpService, 'get').mockReturnValueOnce(
      of({
        data: {
          ok: true,
          team: {
            id: mockTeamId,
            name: mockTeamName,
            domain: mockTeamDomain,
          },
        },
      } as AxiosResponse)
    );

    // 리다이렉트 URL 검증
    const redirectUrl: string = await slackService.authorizeSlackCode('test-code');

    expect(redirectUrl).toBe(`https://${mockTeamDomain}.slack.com/app_redirect?app=${mockAppId}`);

    // accessToken DB 저장 검증
    const accessToken: string = await slackRepository.getAccessToken(mockTeamId);

    expect(accessToken).not.toBeNull();
    expect(accessToken).toBe(mockAccessToken);
  });

  it(`❌ authorizeSlackCode - auth.service.ts의 fetchOAuthInfo 메서드 인증 실패 시 'https://slack.com'으로 Redirect URL을 반환하는가?`, async () => {
    // 1. Slack OAuth Access Token API Mock (인증 실패)
    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of({
        data: {
          ok: false,
        },
      } as AxiosResponse)
    );

    // 리다이렉트 URL 검증
    const redirectUrl: string = await slackService.authorizeSlackCode('test-code');

    expect(redirectUrl).toBe('https://slack.com');
  });

  it(`❌ authorizeSlackCode - auth.service.ts의 fetchTeamInfo 메서드 인증 실패 시 'https://slack.com'으로 Redirect URL을 반환하는가?`, async () => {
    const mockAccessToken = 'fake-access-token';
    const mockAppId = 'fake-app-id';

    // 1. Slack OAuth Access Token API Mock
    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of({
        data: {
          ok: true,
          access_token: mockAccessToken,
          app_id: mockAppId,
        },
      } as AxiosResponse)
    );

    // 2. Slack Team Info API Mock (인증 실패)
    jest.spyOn(httpService, 'get').mockReturnValueOnce(
      of({
        data: {
          ok: false,
        },
      } as AxiosResponse)
    );

    // 리다이렉트 URL 검증
    const redirectUrl: string = await slackService.authorizeSlackCode('test-code');

    expect(redirectUrl).toBe('https://slack.com');
  });
});
