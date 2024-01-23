import { db } from '../database/init.database';
import { LottoEntity } from '../entities/lotto.entity';

export const getRecentlyDrwNo = async (): Promise<number> => {
  const { drwNo } = await db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select('lottoEntity.drwNo AS drwNo')
    .orderBy('drwNo', 'DESC')
    .getRawOne();

  return drwNo;
};
