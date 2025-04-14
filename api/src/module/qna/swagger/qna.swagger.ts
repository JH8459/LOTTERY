import { QnaRegistInfoDto } from '../dto/qna.dto';
import { SwaggerMethod } from 'src/common/interface/swagger.interface';
import { ApiOKResponseDto } from './dto/response.dto';
import { HttpStatus } from '@nestjs/common';
import { BadRequestError } from '../error/400.error';

export const QNA_SWAGGER: SwaggerMethod = {
  POST: {
    API_OPERATION: {
      summary: '문의하기 API',
      description: '작성된 문의하기 내용을 기반으로 DB에 저장한다.',
    },
    API_BODY: {
      description: '문의하기 FORM의 내용을 전달합니다.',
      required: true,
      type: QnaRegistInfoDto,
      examples: {
        A: {
          summary: '입력 문의하기 FORM 예시',
          description: 'FORM에 기재된 필수값과 옵션값들을 전달합니다.',
          value: {
            name: '김정현',
            email: 'kk_ong2233@naver.com',
            question: '안녕하세요. 문의사항이 있어 문의드립니다.',
          },
        },
      },
    },
    API_OK_RESPONSE: {
      status: 201,
      description: '문의하기 성공',
      type: ApiOKResponseDto,
    },
    API_BAD_REQUEST_RESPONSE: {
      status: 400,
      description: '잘못된 요청',
      content: {
        'application/json': {
          examples: {
            NAME: {
              summary: '잘못된 이름 요청 예시',
              value: {
                statusCode: BadRequestError.NAME.statusCode,
                message: BadRequestError.NAME.message,
              },
            },
            EMAIL: {
              summary: '잘못된 이메일 요청 예시',
              value: {
                statusCode: BadRequestError.EMAIL.statusCode,
                message: BadRequestError.EMAIL.message,
              },
            },
          },
        },
      },
    },
  },
};
