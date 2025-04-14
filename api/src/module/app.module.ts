import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from '@nestjs-modules/ioredis';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notification/notification.module';
import { WINSTON_CONFIG } from 'src/config/logger.config';
import { EMAIL_CONFIG } from 'src/config/email.config';
import { BULL_CONFIG, REDIS_CONFIG } from 'src/config/redis.config';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG, TYPE_ORM_TEST_CONFIG } from 'src/config/typeorm.config';
import { QnaModule } from './qna/qna.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(process.env.API_NODE_ENV === 'test' ? TYPE_ORM_TEST_CONFIG : TYPE_ORM_CONFIG),
    MailerModule.forRootAsync(EMAIL_CONFIG),
    RedisModule.forRootAsync(REDIS_CONFIG),
    BullModule.forRootAsync(BULL_CONFIG),
    WinstonModule.forRoot(WINSTON_CONFIG),
    HealthModule,
    NotificationsModule,
    SchedulerModule,
    RedisModule,
    QnaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
