import { ApiBodyOptions, ApiOperationOptions } from '@nestjs/swagger';
import { InputEmailDto } from '../dto/inputEmail.dto';

export const SEND_EMAIL = {
  POST: {
    API_OPERATION: {
      summary: '샘플 이메일 발송 API',
      description: '이메일 주소를 입력 받아 현재 REDIS에 저장된 내용을 기반으로한 이메일을 발송한다.',
    } as ApiOperationOptions,
    API_BODY: {
      description: '이메일을 입력합니다.',
      required: true,
      type: InputEmailDto,
      examples: {
        A: {
          summary: '입력 이메일 예시',
          description: '이메일 형식에 알맞은 문자열을 입력합니다.',
          value: {
            emailInfo: 'kk_ong2233@naver.com',
          },
        },
      },
    } as ApiBodyOptions,
  },
};
