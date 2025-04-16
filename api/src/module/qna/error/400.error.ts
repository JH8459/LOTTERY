import { HttpStatus } from '@nestjs/common';
import { ErrorType } from 'src/common/type/error.type';

export const BadRequestError: ErrorType = {
  NAME: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '성함은 100자 이내로 입력해주세요.',
  },
  EMAIL: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '이메일은 200자 이내로 입력해주세요.',
  },
};
