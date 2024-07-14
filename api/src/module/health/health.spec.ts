import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthModule } from './health.module';

describe('Health Module Test', () => {
  let module: TestingModule;
  let controller: HealthController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('Health Module이 정상적으로 작동하는가?', async () => {
    expect(module).toBeDefined();
  });

  it('Health Controller가 정상적으로 작동하는가?', async () => {
    expect(controller).toBeDefined();
  });
});

describe('Health Controller Test', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('Health Controller의 getHealth 메서드의 응답은 Date 객체인가?', async () => {
    const result = await controller.getHealth();

    expect(result.data).toBeInstanceOf(Date);
  });
});
