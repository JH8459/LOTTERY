import { BadRequestException, Injectable } from '@nestjs/common';
import { QnaRepository } from './repository/qna.repository';
import { QnaRegistInfoDto } from './dto/qna.dto';

@Injectable()
export class QnaService {
  constructor(private qnaRepository: QnaRepository) {}

  async requestQuestion(qnaRegistInfo: QnaRegistInfoDto): Promise<void> {
    if (!qnaRegistInfo) {
      throw new BadRequestException('문의하기 정보가 없습니다.');
    }

    if (qnaRegistInfo.name.length > 100) {
      throw new BadRequestException('성함은 100자 이내로 입력해주세요.');
    }

    if (qnaRegistInfo.email.length > 200) {
      throw new BadRequestException('이메일은 200자 이내로 입력해주세요.');
    }

    await this.qnaRepository.insertQna(qnaRegistInfo);
  }
}
