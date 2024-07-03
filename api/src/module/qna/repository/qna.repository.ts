import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnaEntity } from 'src/entity/qna.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QnaRepository {
  constructor(@InjectRepository(QnaEntity) private readonly qnaModel: Repository<QnaEntity>) {}
}
