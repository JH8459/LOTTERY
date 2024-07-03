import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnaEntity } from 'src/entity/qna.entity';
import { Repository } from 'typeorm';
import { QnaRegistInfoDto } from '../dto/qna.dto';

@Injectable()
export class QnaRepository {
  constructor(@InjectRepository(QnaEntity) private readonly qnaModel: Repository<QnaEntity>) {}

  async insertQna(qnaRegistInfo: QnaRegistInfoDto): Promise<void> {
    await this.qnaModel.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(QnaEntity)
        .values({ ...qnaRegistInfo })
        .execute();
    });
  }
}
