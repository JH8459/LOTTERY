import { db } from '../database/init.database';
import { SpeettoEntity } from '../entities/speetto.entity';
import { SpeettoPrizeInfo } from '../services/interface/scheduler.interface';

export const insertSpeetoPrizeInfo = async ({
  drwNo,
  speettoType,
  firstPrizeDate,
  firstWinAmnt,
  firstWinCnt,
  secondPrizeDate,
  secondWinAmnt,
  secondWinCnt,
  thirdPrizeDate,
  thirdWinAmnt,
  thirdWinCnt,
  saleDate,
  saleRate,
}: SpeettoPrizeInfo): Promise<void> => {
  await db
    .getRepository(SpeettoEntity)
    .createQueryBuilder('speettoEntity')
    .insert()
    .into(SpeettoEntity)
    .values({
      drwNo,
      speettoType,
      firstPrizeDate,
      firstWinAmnt,
      firstWinCnt,
      secondPrizeDate,
      secondWinAmnt,
      secondWinCnt,
      thirdPrizeDate,
      thirdWinAmnt,
      thirdWinCnt,
      saleDate,
      saleRate,
    })
    .orUpdate(
      [
        'first_prize_date',
        'first_winamnt',
        'first_win_cnt',
        'second_prize_date',
        'second_winamnt',
        'second_win_cnt',
        'third_prize_date',
        'third_winamnt',
        'third_win_cnt',
        'sale_date',
        'sale_rate',
      ],
      ['drw_no', 'speetto_type']
    )
    .execute();
};
