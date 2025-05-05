import { InputEmailDto, InputVerificationDto } from '../dto/input.dto';
import { SwaggerMethod } from 'src/common/interface/swagger.interface';
import { InternalServerError } from '../error/500.error';
import { HttpStatus } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { BadRequestError } from '../error/400.error';

export const SEND_VERIFICATION_EMAIL_SWAGGER: SwaggerMethod = {
  POST: {
    API_OPERATION: {
      summary: '인증코드 이메일 발송 API',
      description: '이메일 주소를 입력 받아 6자리 인증코드 이메일을 발송한다.',
    },
    API_BODY: {
      description: '이메일을 입력합니다.',
      required: true,
      type: InputEmailDto,
      examples: {
        A: {
          summary: '입력 예시',
          description: '이메일 형식에 알맞은 문자열을 입력합니다.',
          value: {
            emailInfo: 'kk_ong2233@naver.com',
          },
        },
      },
    },
    API_OK_RESPONSE: {
      status: HttpStatus.OK,
      description: '요청 성공시 응답',
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          message: '인증코드 이메일 발송 요청 성공',
        } as ResponseDto,
      },
    },
    API_BAD_REQUEST_RESPONSE: {
      status: HttpStatus.BAD_REQUEST,
      description: '잘못된 요청시 응답',
      content: {
        'application/json': {
          examples: {
            EMAIL_EMPTY: {
              summary: '잘못된 요청 예시 (이메일 주소를 입력하지 않은 경우)',
              value: {
                statusCode: BadRequestError.EMAIL_EMPTY.statusCode,
                message: BadRequestError.EMAIL_EMPTY.message,
              },
            },
            EMAIL_INVALID: {
              summary: '잘못된 요청 예시 (이메일 주소 형식이 올바르지 않은 경우)',
              value: {
                statusCode: BadRequestError.EMAIL_INVALID.statusCode,
                message: BadRequestError.EMAIL_INVALID.message,
              },
            },
          },
        },
      },
    },
    API_INTERNEL_SERVER_ERR_RESPONSE: {
      status: 500,
      description: '서버 에러',
      content: {
        'application/json': {
          examples: {
            INTERNAL_SERVER_ERROR: {
              summary: '서버 에러 예시',
              value: {
                statusCode: InternalServerError.EMAIL_SEND.statusCode,
                message: InternalServerError.EMAIL_SEND.message,
              },
            },
          },
        },
      },
    },
  },
};

export const SEND_EMAIL_SWAGGER: SwaggerMethod = {
  POST: {
    API_OPERATION: {
      summary: '뉴스레터 이메일 발송 API',
      description: '이메일 주소와 6자리 인증코드를 입력 받아 뉴스레터 이메일을 발송한다.',
    },
    API_BODY: {
      description: '이메일과 인증코드를 입력합니다.',
      required: true,
      type: InputVerificationDto,
      examples: {
        A: {
          summary: '입력 예시',
          description: '이메일 형식과 인증코드에 알맞은 문자열을 입력합니다.',
          value: {
            emailInfo: 'kk_ong2233@naver.com',
            verificationCode: '123456',
          },
        },
      },
    },
    API_OK_RESPONSE: {
      status: HttpStatus.OK,
      description: '응답 성공',
      type: ResponseDto,
    },
    API_INTERNEL_SERVER_ERR_RESPONSE: {
      status: 500,
      description: '서버 에러',
      content: {
        'application/json': {
          examples: {
            INTERNAL_SERVER_ERROR: {
              summary: '서버 에러 예시',
              value: {
                statusCode: InternalServerError.EMAIL_SEND.statusCode,
                message: InternalServerError.EMAIL_SEND.message,
              },
            },
          },
        },
      },
    },
  },
};
