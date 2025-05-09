import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeettoInfoInterface } from 'src/common/interface/speetto.interface';
import { SpeettoEntity } from 'src/entity/speetto.entity';
import { Repository } from 'typeorm';

/**
 * @description SpeettoSlackRepository는 Slack 알림을 위한 스피또 회차 정보 및 당첨 정보를 조회하는 클래스입니다.
 * 스피또 관련 데이터를 DB에서 조회하고 Slack 메시지 포맷에 사용할 수 있도록 제공합니다.
 * @constructor
 * @param {Repository<SpeettoEntity>} speettoModel - 스피또 정보를 관리하는 TypeORM Repository입니다.
 */
@Injectable()
export class SpeettoSlackRepository {
  constructor(@InjectRepository(SpeettoEntity) private readonly speettoModel: Repository<SpeettoEntity>) {}

  /**
   * @description 주어진 스피또 유형(speettoType)에 해당하는 최신 회차 정보를 조회합니다.
   * 조회 결과는 가장 최근 회차 기준으로 하나만 반환되며, Slack 메시지용 포맷에 적합한 필드만 포함됩니다.
   * @param {number} speettoType - 스피또 유형 (예: 500, 1000, 2000)
   * @returns {Promise<SpeettoInfoInterface>} 최신 스피또 회차 당첨 정보 객체
   */
  async getSpeettoInfo(speettoType: number): Promise<SpeettoInfoInterface> {
    const speettoInfo: SpeettoInfoInterface = await this.speettoModel
      .createQueryBuilder('speettoEntity')
      .select([
        'speettoEntity.drwNo AS drwNo',
        'speettoEntity.speettoType AS speettoType',
        'speettoEntity.firstPrizeDate AS firstPrizeDate',
        'speettoEntity.firstWinAmnt AS firstWinAmnt',
        'speettoEntity.firstWinCnt AS firstWinCnt',
        'speettoEntity.secondPrizeDate AS secondPrizeDate',
        'speettoEntity.secondWinAmnt AS secondWinAmnt',
        'speettoEntity.secondWinCnt AS secondWinCnt',
        'speettoEntity.thirdPrizeDate AS thirdPrizeDate',
        'speettoEntity.thirdWinAmnt AS thirdWinAmnt',
        'speettoEntity.thirdWinCnt AS thirdWinCnt',
        'speettoEntity.saleDate AS saleDate',
        'speettoEntity.saleRate AS saleRate',
      ])
      .where('speettoEntity.speettoType = :speettoType', { speettoType })
      .orderBy('speettoEntity.drwNo', 'DESC')
      .limit(1)
      .getRawOne();

    return speettoInfo;
  }
}
