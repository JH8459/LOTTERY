import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from 'src/config/logger.config';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WinstonModule.forRoot(WINSTON_CONFIG), HealthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
