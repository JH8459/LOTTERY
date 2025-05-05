import { HttpStatus } from '@nestjs/common';
import { ErrorType } from 'src/common/type/error.type';

export const BadRequestError: ErrorType = {
  EMAIL_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '이메일 주소는 필수입니다.',
  },
  EMAIL_INVALID: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '이메일 주소 형식이 올바르지 않습니다.',
  },
  VERIFICATION_CODE_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '인증 코드는 필수입니다.',
  },
  VERIFICATION_CODE_INVALID: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '인증 코드 형식이 올바르지 않습니다.',
  },
};
