import { HttpStatus } from '@nestjs/common';
import { ErrorType } from 'src/common/type/error.type';

export const InternalServerError: ErrorType = {
  EMAIL_REQUEST: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '이메일 발송 중 오류가 발생했습니다.',
  },
  EMAIL_SEND: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '메일 전송에 실패했습니다.',
  },
};
