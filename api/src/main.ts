import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './common/swagger/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { validationOptions } from './config/validation.config';
import { ServerErrorFilter } from './common/error/error.filter';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger(WINSTON_CONFIG),
  });

  const configService = app.get(ConfigService);
  // CORS Setting, 옵션 처리
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });
  // Proxy Setting, 환경에서 실제 IP 분별 처리
  app.set('trust proxy', true);
  // Swagger Options Setting, API DOCS 처리
  setupSwagger(app);
  // Validation Pipe Setting, 유효성 검사 처리
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  // ExceptionFilter Setting, 예외 통합 처리
  app.useGlobalFilters(new ServerErrorFilter());
  // Winston Logger Setting, 서버 로그 처리
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // ResponseInterceptor Setting, 응답 통합 처리
  app.useGlobalInterceptors(new ResponseInterceptor());

  const API_SERVER_PORT = configService.get<number>('API_SERVER_PORT');

  await app.listen(API_SERVER_PORT, '0.0.0.0');
}
bootstrap();
