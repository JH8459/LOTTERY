import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, QueryFailedError, Error)
export class ServerErrorFilter implements ExceptionFilter {
  async catch(exception: HttpException | QueryFailedError | Error, host: ArgumentsHost) {
    // 로그에 보낼 변수 선언
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    console.log('❌ Error: ', exception);

    if (exception instanceof HttpException) {
      // HttpException Error 처리
      const status: number = exception.getStatus();
      const error: string | object = exception.getResponse();

      return response.status(status).json(error);
    } else {
      // 알수 없는 DB 혹은 Node 에러의 경우
      const status: number = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = exception instanceof QueryFailedError ? '데이터베이스 장애 발생' : '서버 장애 발생';

      return response.status(status).json({ statusCode: status, name: exception.name, message });
    }
  }
}
