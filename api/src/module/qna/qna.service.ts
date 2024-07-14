import { BadRequestException, Injectable } from '@nestjs/common';
import { QnaRepository } from './repository/qna.repository';
import { QnaRegistInfoDto } from './dto/qna.dto';
import { BadRequestError } from './error/400.error';

@Injectable()
export class QnaService {
  constructor(private qnaRepository: QnaRepository) {}

  async requestQuestion(qnaRegistInfo: QnaRegistInfoDto): Promise<void> {
    if (qnaRegistInfo.name.length > 100) {
      throw new BadRequestException(BadRequestError.NAME.message);
    }

    if (qnaRegistInfo.email.length > 200) {
      throw new BadRequestException(BadRequestError.EMAIL.message);
    }

    await this.qnaRepository.insertQna(qnaRegistInfo);
  }
}
