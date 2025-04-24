import { Injectable } from '@nestjs/common';
import { QnaRepository } from './repository/qna.repository';
import { QnaRegistInfoDto } from './dto/qna.dto';
import { CustomBadRequestException } from 'src/common/custom/exception/exception.service';
import { BadRequestError } from './error/400.error';
import { WebHookService } from '../notification/slack/util/webhook.service';

@Injectable()
export class QnaService {
  constructor(private readonly webhookService: WebHookService, private readonly qnaRepository: QnaRepository) {}

  async requestQuestion(qnaRegistInfo: QnaRegistInfoDto): Promise<void> {
    if (qnaRegistInfo.name.length > 100) {
      throw new CustomBadRequestException(BadRequestError.NAME.message);
    }

    if (qnaRegistInfo.email.length > 200) {
      throw new CustomBadRequestException(BadRequestError.EMAIL.message);
    }

    await this.qnaRepository.insertQna(qnaRegistInfo);

    const slackMessage = `QnA 요청이 들어왔습니다.\n이름: ${qnaRegistInfo.name}\n이메일: ${qnaRegistInfo.email}\n내용: ${qnaRegistInfo.question}`;

    this.webhookService.sendSlackWebHookMessage(slackMessage);
  }
}
