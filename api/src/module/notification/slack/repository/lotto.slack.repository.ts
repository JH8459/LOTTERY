import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoInfoInterface } from 'src/common/interface/lotto.interface';
import { LottoEntity } from 'src/entity/lotto.entity';
import { Repository } from 'typeorm';

/**
 * @description LottoSlackRepository는 Slack 알림을 위한 로또 회차 정보 및 당첨 정보를 조회하는 클래스입니다.
 * 로또 관련 데이터를 DB에서 조회하고 Slack 메시지 포맷에 사용할 수 있도록 제공합니다.
 * @constructor
 * @param {Repository<LottoEntity>} lottoModel - 로또 정보를 관리하는 TypeORM Repository입니다.
 */
@Injectable()
export class LottoSlackRepository {
  constructor(@InjectRepository(LottoEntity) private readonly lottoModel: Repository<LottoEntity>) {}

  /**
   * @description DB에서 가장 최근 로또 회차 번호를 조회합니다.
   * @returns {Promise<number>} 최근 로또 회차 번호
   */
  async getRecentlyLottoDrwNo(): Promise<number> {
    const { drwNo } = await this.lottoModel
      .createQueryBuilder('lottoEntity')
      .select('lottoEntity.drwNo AS drwNo')
      .orderBy('lottoEntity.drwNo', 'DESC')
      .getRawOne();

    return drwNo;
  }

  /**
   * @description 지정된 회차 번호(drwNo)에 해당하는 로또 당첨 정보를 조회합니다.
   * @param {number} drwNo - 조회할 로또 회차 번호
   * @returns {Promise<LottoInfoInterface>} 해당 회차의 로또 당첨 정보
   */
  async getLottoInfo(drwNo: number): Promise<LottoInfoInterface> {
    const lottoInfo: LottoInfoInterface = await this.lottoModel
      .createQueryBuilder('lottoEntity')
      .select([
        'lottoEntity.drwNo AS drwNo',
        'lottoEntity.drwtNo1 AS drwtNo1',
        'lottoEntity.drwtNo2 AS drwtNo2',
        'lottoEntity.drwtNo3 AS drwtNo3',
        'lottoEntity.drwtNo4 AS drwtNo4',
        'lottoEntity.drwtNo5 AS drwtNo5',
        'lottoEntity.drwtNo6 AS drwtNo6',
        'lottoEntity.bnusNo AS bnusNo',
        'lottoEntity.firstWinamnt AS firstWinamnt',
        'lottoEntity.firstPrzwnerCo AS firstPrzwnerCo',
        'lottoEntity.secondWinamnt AS secondWinamnt',
        'lottoEntity.secondPrzwnerCo AS secondPrzwnerCo',
        'lottoEntity.thirdWinamnt AS thirdWinamnt',
        'lottoEntity.thirdPrzwnerCo AS thirdPrzwnerCo',
        'lottoEntity.drwNoDate AS drwNoDate',
      ])
      .where('lottoEntity.drwNo = :drwNo', { drwNo })
      .getRawOne();

    return lottoInfo;
  }
}
