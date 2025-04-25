import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { LoggerMiddleware } from 'src/common/custom/logger/logger.middleware';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notification/notification.module';
import { EMAIL_CONFIG } from 'src/config/email.config';
import { BULL_CONFIG, REDIS_CONFIG } from 'src/config/redis.config';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG } from 'src/config/typeorm.config';
import { QnaModule } from './qna/qna.module';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from './logger/logger.module';
import { ValidationPipeService } from 'src/common/custom/pipe/pipe.service';
import { ResponseInterceptor } from 'src/common/custom/interceptor/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(TYPE_ORM_CONFIG),
    MailerModule.forRootAsync(EMAIL_CONFIG),
    IORedisModule.forRootAsync(REDIS_CONFIG),
    BullModule.forRootAsync(BULL_CONFIG),
    HealthModule,
    LoggerModule,
    RedisModule,
    NotificationsModule,
    SchedulerModule,
    QnaModule,
  ],
  providers: [ValidationPipeService, ResponseInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
