import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ResponseInterceptor } from './common/custom/interceptor/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './config/swagger.config';
import { ServerErrorFilter } from './common/custom/filter/error.filter';
import { CustomLoggerService } from './module/logger/logger.service';
import { ValidationPipeService } from './common/custom/pipe/pipe.service';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: true,
    },
  });

  const configService = app.get(ConfigService);
  const validationPipeService = app.get(ValidationPipeService);
  const customLoggerService = app.get(CustomLoggerService);
  const responseInterceptor = app.get(ResponseInterceptor);

  // CORS Setting, 옵션 처리
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });
  // Proxy Setting, 실제 IP 분별 처리
  app.set('trust proxy', true);
  // Swagger Options Setting, API DOCS 처리
  setupSwagger(app);
  // Validation Pipe Setting, 유효성 검사 처리
  app.useGlobalPipes(new ValidationPipe(validationPipeService.getConfig()));
  // Exception Global Filter 적용, 에러 처리 및 로깅
  app.useGlobalFilters(new ServerErrorFilter(customLoggerService));
  // ResponseInterceptor Setting, 응답 통합 처리
  app.useGlobalInterceptors(responseInterceptor);

  const API_SERVER_PORT = configService.get<number>('API_SERVER_PORT');

  await app.listen(API_SERVER_PORT, '0.0.0.0');
}
bootstrap();
