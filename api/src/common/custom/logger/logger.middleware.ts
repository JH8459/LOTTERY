import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomLoggerService } from './logger.service';

/**
 *
 * @description: 모든 요청에 대한 로깅을 처리하는 미들웨어 클래스입니다.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const ip: string = req.ip;
    const startTime: number = Date.now();

    res.on('finish', async () => {
      const duration: number = Date.now() - startTime;

      this.logger.log(`${ip} ${originalUrl} ${method} ${statusCode} - ${duration}ms`);
    });
    next();
  }
}
