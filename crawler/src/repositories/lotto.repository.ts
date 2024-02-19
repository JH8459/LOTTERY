import { EntityManager, getManager } from 'typeorm';
import { db } from '../database/init.database';
import { LottoEntity } from '../entities/lotto.entity';
import { DrwtNoInfoEnum } from '../services/constant/enum';
import { DrwInfoDto } from '../services/dto/drwInfo.dto';
import { HighestPrizeDrwNoInterface, StatisticDrwNoInterface } from '../services/interface/scheduler.interface';

export const getRecentlyDrwNo = async (): Promise<number> => {
  const { drwNo } = await db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select('lottoEntity.drwNo AS drwNo')
    .orderBy('drwNo', 'DESC')
    .getRawOne();

  return drwNo;
};

export const getStatisticByDrwNo = async (): Promise<StatisticDrwNoInterface[]> => {
  const union1Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.drwtNo1 AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.drwtNo1')
    .getQuery();

  const union2Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.drwtNo2 AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.drwtNo2')
    .getQuery();

  const union3Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.drwtNo3 AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.drwtNo3')
    .getQuery();

  const union4Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.drwtNo4 AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.drwtNo4')
    .getQuery();

  const union5Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.drwtNo5 AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.drwtNo5')
    .getQuery();

  const union6Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.drwtNo6 AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.drwtNo6')
    .getQuery();

  const union7Query = db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select(['lottoEntity.bnusNo AS lottoNo', 'COUNT(*) AS cnt'])
    .groupBy('lottoEntity.bnusNo')
    .getQuery();
  // UNION ALL
  const unionAllQuery = `((${union1Query}) UNION ALL (${union2Query}) UNION ALL (${union3Query}) UNION ALL (${union4Query}) UNION ALL (${union5Query}) UNION ALL (${union6Query}) UNION ALL (${union7Query}))`;
  // 1~45번 (보너스 번호 포함) 번호 별 통계 내림차순
  const statisticInfoList: StatisticDrwNoInterface[] = await db
    .createQueryBuilder()
    .select(['lottoNo AS lottoNo', 'CAST(SUM(cnt) AS DOUBLE) AS cnt'])
    .from(unionAllQuery, 'union')
    .groupBy('lottoNo')
    .orderBy('cnt', 'DESC')
    .getRawMany();

  return statisticInfoList;
};

export const getHighestPrizeByYear = async (date: Date): Promise<HighestPrizeDrwNoInterface[]> => {
  const highestPrizeInfoList: HighestPrizeDrwNoInterface[] = await db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select([
      'lottoEntity.drwNo AS drwNo',
      'lottoEntity.firstWinamnt AS firstWinamnt',
      'lottoEntity.firstPrzwnerCo AS firstPrzwnerCo',
      'lottoEntity.drwNoDate AS drwNoDate',
    ])
    .where(
      `(YEAR(lottoEntity.drwNoDate), lottoEntity.firstWinamnt) IN 
        (
          (
            SELECT 
              YEAR(lottoEntity.drwNoDate), 
              MAX(lottoEntity.firstWinamnt) 
            FROM 
              lotto as lottoEntity
            WHERE 
              YEAR(lottoEntity.drwNoDate) = :date
          ), 
          (
            SELECT 
              YEAR(lottoEntity.drwNoDate), 
              MAX(lottoEntity.firstWinamnt) 
            FROM 
            lotto as lottoEntity
            WHERE 
              YEAR(lottoEntity.drwNoDate) = :date - 1
          )
        )`,
      { date: date.getFullYear() }
    )
    .orderBy('drwNoDate')
    .getRawMany();

  return highestPrizeInfoList;
};

export const insertDrwInfo = async ({
  drwNo,
  drwtNoList,
  firstWinamnt,
  firstPrzwnerCo,
  secondWinamnt,
  secondPrzwnerCo,
  thirdWinamnt,
  thirdPrzwnerCo,
  drwNoDate,
}: DrwInfoDto): Promise<void> => {
  await db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .insert()
    .into(LottoEntity)
    .values({
      drwNo,
      drwtNo1: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.ONE)?.value,
      drwtNo2: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.TWO)?.value,
      drwtNo3: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.THREE)?.value,
      drwtNo4: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.FOUR)?.value,
      drwtNo5: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.FIVE)?.value,
      drwtNo6: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.SIX)?.value,
      bnusNo: drwtNoList.find((drwInfo) => drwInfo.no === DrwtNoInfoEnum.BONUS)?.value,
      firstWinamnt,
      firstPrzwnerCo,
      secondWinamnt,
      secondPrzwnerCo,
      thirdWinamnt,
      thirdPrzwnerCo,
      drwNoDate,
    })
    .orUpdate(
      [
        'drwt_no_1',
        'drwt_no_2',
        'drwt_no_3',
        'drwt_no_4',
        'drwt_no_5',
        'drwt_no_6',
        'bnus_no',
        'first_winamnt',
        'first_przwner_co',
        'second_winamnt',
        'second_przwner_co',
        'third_winamnt',
        'third_przwner_co',
        'drw_no_date',
      ],
      ['drw_no']
    )
    .execute();
};
