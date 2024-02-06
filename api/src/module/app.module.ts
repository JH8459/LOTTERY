import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notification/notification.module';
import { WINSTON_CONFIG } from 'src/config/logger.config';
import { EMAIL_CONFIG } from 'src/config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync(EMAIL_CONFIG),
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
