import * as supertest from 'supertest';
import { Response as SupertestResponse } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { WorkspaceSlackRepository } from 'src/module/notification/slack/repository/workspace.slack.repository';
import { AppModule } from 'src/module/app.module';

describe('SlackController E2E - /slack/auth', () => {
  let app: INestApplication;
  let httpService: HttpService;
  let workspaceSlackRepository: WorkspaceSlackRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpService = app.get<HttpService>(HttpService);
    workspaceSlackRepository = app.get<WorkspaceSlackRepository>(WorkspaceSlackRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it(`✅ '/slack/auth' API`, async () => {
    const mockAccessToken = 'fake-access-token';
    const mockAppId = 'fake-app-id';
    const mockTeamId = 'fake-team-id';
    const mockTeamName = 'fake-team-name';
    const mockTeamDomain = 'fake-domain';
    const code = 'test-code';
    const expectedRedirectUrl = `https://${mockTeamDomain}.slack.com/app_redirect?app=${mockAppId}`;

    // 1. Slack OAuth Access Token API Mock (인증 성공 ✅)
    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of({
        data: {
          ok: true,
          access_token: mockAccessToken,
          app_id: mockAppId,
        },
      } as AxiosResponse)
    );

    // 2. Slack Team Info API Mock (인증 성공 ✅)
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

    // API 응답이 의도한 URL로 리다이렉트 되는지 검증
    const response: SupertestResponse = await supertest(app.getHttpServer())
      .get(`/slack/auth?code=${code}`)
      .expect(302);

    const locationHeader: string | undefined = response.header?.location;

    expect(locationHeader).toBeDefined();
    expect(locationHeader).toBe(expectedRedirectUrl);

    // API 호출 후 accessToken이 DB에 저장되었는지 검증
    const accessToken = await workspaceSlackRepository.getAccessToken(mockTeamId);

    expect(accessToken).toBeDefined();
    expect(accessToken).toBe(mockAccessToken);
  });

  it(`❌ '/slack/auth' API - Slack OAuth Access Token API 인증 실패 시`, async () => {
    const code = 'test-code';
    const expectedRedirectUrl = 'https://slack.com';

    // 1. Slack OAuth Access Token API Mock (인증 실패 ❌)
    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of({
        data: {
          ok: false,
        },
      } as AxiosResponse)
    );

    // API 응답이 의도한 URL로 리다이렉트 되는지 검증
    const response: SupertestResponse = await supertest(app.getHttpServer())
      .get(`/slack/auth?code=${code}`)
      .expect(302);

    const locationHeader: string | undefined = response.header?.location;

    expect(locationHeader).toBeDefined();
    expect(locationHeader).toBe(expectedRedirectUrl);
  });

  it(`❌ '/slack/auth' API - Slack Team Info API 인증 실패 시`, async () => {
    const mockAccessToken = 'fake-access-token';
    const mockAppId = 'fake-app-id';
    const code = 'test-code';
    const expectedRedirectUrl = 'https://slack.com';

    // 1. Slack OAuth Access Token API Mock (인증 성공 ✅)
    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of({
        data: {
          ok: true,
          access_token: mockAccessToken,
          app_id: mockAppId,
        },
      } as AxiosResponse)
    );

    // 2. Slack Team Info API Mock (인증 실패 ❌)
    jest.spyOn(httpService, 'get').mockReturnValueOnce(
      of({
        data: {
          ok: false,
        },
      } as AxiosResponse)
    );

    // API 응답이 의도한 URL로 리다이렉트 되는지 검증
    const response: SupertestResponse = await supertest(app.getHttpServer())
      .get(`/slack/auth?code=${code}`)
      .expect(302);

    const locationHeader: string | undefined = response.header?.location;

    expect(locationHeader).toBeDefined();
    expect(locationHeader).toBe(expectedRedirectUrl);
  });
});
