import { ApiBodyOptions, ApiOperationOptions } from '@nestjs/swagger';
import { QnaRegistInfoDto } from '../dto/qna.dto';

export const QNA = {
  POST: {
    API_OPERATION: {
      summary: '문의하기 API',
      description: '작성된 문의하기 내용을 기반으로 DB에 저장한다.',
    } as ApiOperationOptions,
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
          } as QnaRegistInfoDto,
        },
      },
    } as ApiBodyOptions,
  },
};
