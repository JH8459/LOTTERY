import { db } from '../database/init.database';
import { LottoEntity } from '../entities/lotto.entity';
import { DrwtNoInfoEnum } from '../services/constant/enum';
import { DrwInfoDto } from '../services/dto/drwInfo.dto';

export const getRecentlyDrwNo = async (): Promise<number> => {
  const { drwNo } = await db
    .getRepository(LottoEntity)
    .createQueryBuilder('lottoEntity')
    .select('lottoEntity.drwNo AS drwNo')
    .orderBy('drwNo', 'DESC')
    .getRawOne();

  return drwNo;
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
