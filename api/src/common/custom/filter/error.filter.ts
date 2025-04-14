import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomLoggerService } from '../../../module/logger/logger.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 *
 * @description: 서버에서 발생하는 모든 에러를 처리하는 클래스입니다.
 */
@Catch(UnauthorizedException, HttpException, QueryFailedError, Error)
export class ServerErrorFilter implements ExceptionFilter {
  constructor(private readonly loggerService: CustomLoggerService) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      // 의도적으로 발생한 에러 CASE
      this.loggerService.warn(
        `${request.ip}, ${request.originalUrl}, ${request.method}, params: ${JSON.stringify(
          request.params
        )},  query: ${JSON.stringify(request.query)}, body: ${JSON.stringify(request.body)}`
      );

      return response.status(exception.getStatus()).json(exception.getResponse());
    } else if (exception instanceof UnauthorizedException) {
      // 외도하지 않은 인증 관련 발생한 에러 CASE
      await this.loggerService.error(
        `${request.ip}, ${request.originalUrl}, ${request.method}, params: ${JSON.stringify(
          request.params
        )},  query: ${JSON.stringify(request.query)}, body: ${JSON.stringify(request.body)}`,
        exception.stack
      );

      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: '사용할 수 없는 토큰입니다.',
      });
    } else {
      // 그 외 의도하지 않은 알 수 없는 에러 CASE (DB, 서버 에러 등)
      await this.loggerService.error(
        `${request.ip}, ${request.originalUrl}, ${request.method}, params: ${JSON.stringify(
          request.params
        )},  query: ${JSON.stringify(request.query)}, body: ${JSON.stringify(request.body)}`,
        exception.stack
      );

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '알 수 없는 에러 입니다.',
      });
    }
  }
}
