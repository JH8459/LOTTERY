import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandService } from 'src/module/notification/slack/util/command.service';
import { AppModule } from 'src/module/app.module';
import { Response as SupertestResponse } from 'supertest';

describe('SlackController E2E - /slack/commands', () => {
  let app: INestApplication;
  let commandService: CommandService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    commandService = app.get<CommandService>(CommandService);
  });

  afterAll(async () => {
    await app.close();
  });

  const createSlackFormPayload = (overrides: Partial<Record<string, string>> = {}) => {
    const basePayload: Record<string, string> = {
      token: 'fake-token',
      team_id: 'T0001',
      team_domain: 'test-team',
      channel_id: 'C123456',
      channel_name: 'general',
      user_id: 'U123456',
      user_name: 'testuser',
      text: '테스트',
      response_url: 'https://hooks.slack.com/commands/1234',
      trigger_id: 'trigger-abc',
      command: '',
    };

    const payload = { ...basePayload, ...overrides };

    return new URLSearchParams(payload).toString();
  };

  const commandTestCases = [
    ['/구독', 'subscribeCommandHandler'],
    ['/로또', 'lottoPrizeInfoCommandHandler'],
    ['/스피또', 'speettoPrizeInfoCommandHandler'],
  ] as const;

  describe.each(commandTestCases)(
    `🧪 Slash Command: %s → CommandService.%s 호출 확인`,
    (command: string, handlerMethod: (typeof commandTestCases)[number][1]) => {
      it(`✅ '${command}' 명령어가 ${handlerMethod}로 위임되는가`, async () => {
        const spy = jest.spyOn(commandService, handlerMethod).mockImplementation(async () => {});

        const response = await request(app.getHttpServer())
          .post('/slack/commands')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(createSlackFormPayload({ command }));

        expect(response.status).toBe(200);
        expect(spy).toHaveBeenCalled();
      });
    }
  );
});
