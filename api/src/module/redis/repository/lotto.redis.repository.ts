import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import {
  LottoInfoInterface,
  LottoStatisticInfoInterface,
  LottoHighestPrizeInfoInterface,
} from 'src/common/interface/lotto.interface';

/**
 * @description LottoRedisRepository는 로또 관련 데이터를 Redis에서 읽어와 도메인 객체로 반환하는 역할을 합니다.
 * RedisService를 이용하여 키 기반 조회를 수행하고, 파싱 로직을 포함합니다.
 * @constructor
 * @param {RedisService} redisService - RedisService 인스턴스입니다.
 */
@Injectable()
export class LottoRedisRepository {
  constructor(private readonly redisService: RedisService) {}

  /**
   * @description Redis에 저장된 최근 로또 회차 번호를 가져옵니다.
   * @returns {Promise<number>} 최근 로또 회차 번호
   */
  async getRecentlyLottoDrwNo(): Promise<number> {
    const value = await this.redisService.get('drwNo');

    return Number(value);
  }

  /**
   * @description Redis에 저장된 최근 로또 회차 당첨 정보를 가져옵니다.
   * @returns {Promise<LottoInfoInterface>} 로또 당첨 정보 객체
   */
  async getRecentlyLottoInfo(): Promise<LottoInfoInterface> {
    const keys = [
      'drwNo',
      'drwtNo1',
      'drwtNo2',
      'drwtNo3',
      'drwtNo4',
      'drwtNo5',
      'drwtNo6',
      'bnusNo',
      'firstWinamnt',
      'firstPrzwnerCo',
      'secondWinamnt',
      'secondPrzwnerCo',
      'thirdWinamnt',
      'thirdPrzwnerCo',
      'drwNoDate',
    ];
    const values = await this.redisService.mget(keys);
    const map = Object.fromEntries(keys.map((k, i) => [k, values[i]]));

    return {
      drwNo: Number(map['drwNo']),
      drwtNo1: Number(map['drwtNo1']),
      drwtNo2: Number(map['drwtNo2']),
      drwtNo3: Number(map['drwtNo3']),
      drwtNo4: Number(map['drwtNo4']),
      drwtNo5: Number(map['drwtNo5']),
      drwtNo6: Number(map['drwtNo6']),
      bnusNo: Number(map['bnusNo']),
      firstWinamnt: Number(map['firstWinamnt']),
      firstPrzwnerCo: Number(map['firstPrzwnerCo']),
      secondWinamnt: Number(map['secondWinamnt']),
      secondPrzwnerCo: Number(map['secondPrzwnerCo']),
      thirdWinamnt: Number(map['thirdWinamnt']),
      thirdPrzwnerCo: Number(map['thirdPrzwnerCo']),
      drwNoDate: new Date(map['drwNoDate'] ?? ''),
    };
  }

  /**
   * @description Redis에 저장된 최근 로또 번호 통계 정보를 가져옵니다.
   * @returns {Promise<LottoStatisticInfoInterface>} 로또 통계 정보 객체
   */
  async getRecentlyLottoStatisticInfo(): Promise<LottoStatisticInfoInterface> {
    const keys = [
      'firstLottoNo',
      'firstLottoNoCnt',
      'secondLottoNo',
      'secondLottoNoCnt',
      'thirdLottoNo',
      'thirdLottoNoCnt',
    ];
    const values = await this.redisService.mget(keys);
    const map = Object.fromEntries(keys.map((k, i) => [k, values[i]]));

    return {
      firstLottoNo: Number(map['firstLottoNo']),
      firstLottoNoCnt: Number(map['firstLottoNoCnt']),
      secondLottoNo: Number(map['secondLottoNo']),
      secondLottoNoCnt: Number(map['secondLottoNoCnt']),
      thirdLottoNo: Number(map['thirdLottoNo']),
      thirdLottoNoCnt: Number(map['thirdLottoNoCnt']),
    };
  }

  /**
   * @description Redis에 저장된 최근 로또 당첨금 정보를 가져옵니다.
   * 올해와 작년의 당첨 회차, 금액, 수령자 수 및 일자 정보를 포함합니다.
   * @returns {Promise<LottoHighestPrizeInfoInterface>} 로또 고액 당첨 정보 객체
   */
  async getRecentlyLottoHighestPrizeInfo(): Promise<LottoHighestPrizeInfoInterface> {
    const keys = [
      'thisYearDrwNo',
      'thisYearFirstWinamnt',
      'thisYearFirstPrzwnerCo',
      'thisYearDrwNoDate',
      'lastYearDrwNo',
      'lastYearFirstWinamnt',
      'lastYearFirstPrzwnerCo',
      'lastYearDrwNoDate',
    ];
    const values = await this.redisService.mget(keys);
    const map = Object.fromEntries(keys.map((k, i) => [k, values[i]]));

    return {
      thisYearDrwNo: Number(map['thisYearDrwNo']),
      thisYearFirstWinamnt: Number(map['thisYearFirstWinamnt']),
      thisYearFirstPrzwnerCo: Number(map['thisYearFirstPrzwnerCo']),
      thisYearDrwNoDate: new Date(map['thisYearDrwNoDate'] ?? ''),
      lastYearDrwNo: Number(map['lastYearDrwNo']),
      lastYearFirstWinamnt: Number(map['lastYearFirstWinamnt']),
      lastYearFirstPrzwnerCo: Number(map['lastYearFirstPrzwnerCo']),
      lastYearDrwNoDate: new Date(map['lastYearDrwNoDate'] ?? ''),
    };
  }
}
