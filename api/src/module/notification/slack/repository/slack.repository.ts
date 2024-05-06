import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SlackRepository {
  constructor(@InjectRepository(LottoEntity) private readonly lottoModel: Repository<LottoEntity>) {}

  async getRecentlyDrwNo(): Promise<number> {
    const { drwNo }: LottoEntity = await this.lottoModel
      .createQueryBuilder('lottoEntity')
      .select('lottoEntity.drwNo AS drwNo')
      .orderBy('lottoEntity.drwNo', 'DESC')
      .getRawOne();

    return drwNo;
  }
}
