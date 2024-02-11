import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notification/notification.module';
import { WINSTON_CONFIG } from 'src/config/logger.config';
import { EMAIL_CONFIG } from 'src/config/email.config';
import { REDIS_CONFIG } from 'src/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync(EMAIL_CONFIG),
    RedisModule.forRootAsync(REDIS_CONFIG),
    WinstonModule.forRoot(WINSTON_CONFIG),
    HealthModule,
    NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
