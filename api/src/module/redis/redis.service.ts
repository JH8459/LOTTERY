import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from 'src/common/interface/lotto.interface';
import { SpeettoInfoInterface } from 'src/common/interface/speetto.interface';

@Injectable()
export class RedisService {
  private readonly LOCK_DURATION: number;

  constructor(@InjectRedis() private redis: Redis) {
    this.LOCK_DURATION = 60 * 5; // 5분
  }

  /**
   *
   * @param key
   * @returns lock 획득 여부
   * @description Redis에 Lock을 획득합니다. Lock을 획득하지 못할 경우, null을 반환합니다.
   */
  async setLock(key: string): Promise<string> {
    // Lock 획득
    const lock: string = await this.redis.set(key, 'LOCK', 'EX', this.LOCK_DURATION, 'NX');

    return lock;
  }

  /**
   *
   * @param key
   * @returns lock 해제 여부
   * @description Redis에 Lock을 해제합니다.
   */
  async unLock(key: string): Promise<void> {
    // Lock 해제
    await this.redis.del(key);
  }

  /**
   *
   * @param speettoType
   * @returns 최근 스피또 회차 정보
   * @description Redis에 저장된 최근 스피또 회차 정보를 가져옵니다.
   */
  async getRecentlySpettoInfo(speettoType: number): Promise<SpeettoInfoInterface> {
    const speettoInfo: SpeettoInfoInterface = JSON.parse(await this.redis.get(`speetto${speettoType}Info`));

    return speettoInfo;
  }

  /**
   *
   * @returns 최근 로또 회차 번호
   * @description Redis에 저장된 최근 로또 회차 번호를 가져옵니다.
   */
  async getRecentlyLottoDrwNo(): Promise<number> {
    const recentlyDrwNo: number = Number(await this.redis.get('drwNo'));

    return recentlyDrwNo;
  }

  /**
   *
   * @returns 최근 로또 회차 정보
   * @description Redis에 저장된 최근 로또 회차 정보를 가져옵니다.
   */
  async getRecentlyLottoInfo(): Promise<LottoInfoInterface> {
    const lottoInfo: LottoInfoInterface = {
      drwNo: Number(await this.redis.get('drwNo')),
      drwtNo1: Number(await this.redis.get('drwtNo1')),
      drwtNo2: Number(await this.redis.get('drwtNo2')),
      drwtNo3: Number(await this.redis.get('drwtNo3')),
      drwtNo4: Number(await this.redis.get('drwtNo4')),
      drwtNo5: Number(await this.redis.get('drwtNo5')),
      drwtNo6: Number(await this.redis.get('drwtNo6')),
      bnusNo: Number(await this.redis.get('bnusNo')),
      firstWinamnt: Number(await this.redis.get('firstWinamnt')),
      firstPrzwnerCo: Number(await this.redis.get('firstPrzwnerCo')),
      secondWinamnt: Number(await this.redis.get('secondWinamnt')),
      secondPrzwnerCo: Number(await this.redis.get('secondPrzwnerCo')),
      thirdWinamnt: Number(await this.redis.get('thirdWinamnt')),
      thirdPrzwnerCo: Number(await this.redis.get('thirdPrzwnerCo')),
      drwNoDate: new Date(await this.redis.get('drwNoDate')),
    };

    return lottoInfo;
  }

  /**
   *
   * @returns 최근 로또 통계 정보
   * @description Redis에 저장된 최근 로또 통계 정보를 가져옵니다.
   */
  async getRecentlyLottoStatisticInfo(): Promise<LottoStatisticInfoInterface> {
    const lottoStatisticInfo: LottoStatisticInfoInterface = {
      firstLottoNo: Number(await this.redis.get('firstLottoNo')),
      firstLottoNoCnt: Number(await this.redis.get('firstLottoNoCnt')),
      secondLottoNo: Number(await this.redis.get('secondLottoNo')),
      secondLottoNoCnt: Number(await this.redis.get('secondLottoNoCnt')),
      thirdLottoNo: Number(await this.redis.get('thirdLottoNo')),
      thirdLottoNoCnt: Number(await this.redis.get('thirdLottoNoCnt')),
    };

    return lottoStatisticInfo;
  }

  /**
   *
   * @returns 최근 로또 당첨금 정보
   * @description Redis에 저장된 최근 로또 당첨금 정보를 가져옵니다.
   */
  async getRecentlyLottoHighestPrizeInfo(): Promise<LottoHighestPrizeInfoInterface> {
    const lottoHighestPrizeInfo: LottoHighestPrizeInfoInterface = {
      thisYearDrwNo: Number(await this.redis.get('thisYearDrwNo')),
      thisYearFirstWinamnt: Number(await this.redis.get('thisYearFirstWinamnt')),
      thisYearFirstPrzwnerCo: Number(await this.redis.get('thisYearFirstPrzwnerCo')),
      thisYearDrwNoDate: new Date(await this.redis.get('thisYearDrwNoDate')),
      lastYearDrwNo: Number(await this.redis.get('lastYearDrwNo')),
      lastYearFirstWinamnt: Number(await this.redis.get('lastYearFirstWinamnt')),
      lastYearFirstPrzwnerCo: Number(await this.redis.get('lastYearFirstPrzwnerCo')),
      lastYearDrwNoDate: new Date(await this.redis.get('lastYearDrwNoDate')),
    };

    return lottoHighestPrizeInfo;
  }
}
