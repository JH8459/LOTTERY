import { Injectable } from '@nestjs/common';
import { QnaRepository } from './repository/qna.repository';

@Injectable()
export class QnaService {
  constructor(private qnaRepository: QnaRepository) {}
}
