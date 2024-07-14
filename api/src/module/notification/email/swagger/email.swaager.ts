import { ResponseDto } from 'src/common/dto/response.dto';
import { InputEmailDto } from '../dto/inputEmail.dto';
import { SwaggerMethod } from 'src/common/interface/swagger.interface';
import { ApiOKResponseDto } from './dto/response.dto';
import { InternalServerError } from '../error/500.error';

export const SEND_EMAIL_SWAGGER: SwaggerMethod = {
  GET: {
    API_OPERATION: {
      summary: '구독자 단체 발송 API',
      description: '구독자들에게 현재 REDIS에 저장된 내용을 기반으로한 이메일을 발송한다.',
    },
    API_OK_RESPONSE: {
      status: 200,
      description: '응답 성공',
      type: ApiOKResponseDto,
    },
    API_INTERNAL_SERVER_ERROR_RESPONSE: {
      status: 500,
      description: '서버 에러',
      content: {
        'application/json': {
          examples: {
            INTERNAL_SERVER_ERROR: {
              summary: '서버 에러 예시',
              value: {
                message: InternalServerError.GITHUB.message,
                error: InternalServerError.GITHUB.error,
                statusCode: InternalServerError.GITHUB.statusCode,
              },
            },
          },
        },
      },
    },
  },
  POST: {
    API_OPERATION: {
      summary: '샘플 이메일 발송 API',
      description: '이메일 주소를 입력 받아 현재 REDIS에 저장된 내용을 기반으로한 이메일을 발송한다.',
    },
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
    },
    API_OK_RESPONSE: {
      status: 200,
      description: '응답 성공',
      type: ApiOKResponseDto,
    },
    API_INTERNAL_SERVER_ERROR_RESPONSE: {
      status: 500,
      description: '서버 에러',
      content: {
        'application/json': {
          examples: {
            INTERNAL_SERVER_ERROR: {
              summary: '서버 에러 예시',
              value: {
                message: InternalServerError.EMAIL.message,
                error: InternalServerError.EMAIL.error,
                statusCode: InternalServerError.EMAIL.statusCode,
              },
            },
          },
        },
      },
    },
  },
};
