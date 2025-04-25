import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from 'src/common/interface/lotto.interface';
import { SpeettoInfoInterface } from 'src/common/interface/speetto.interface';

/**
 * @description RedisService는 Redis와의 상호작용을 관리하는 서비스 클래스입니다.
 * @constructor
 * @param {Redis} redis - Redis Client 인스턴스입니다.
 * @property { number } LOCK_DURATION - Lock의 지속 시간입니다. 기본값은 5분입니다.
 */
@Injectable()
export class RedisService {
  private readonly LOCK_DURATION: number;

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.LOCK_DURATION = 60 * 5; // 5분
  }

  /**
   * @description ioredis의 원시 메서드 사용이 필요한 경우 사용합니다.
   * @returns {Redis} ioredis의 원시 메서드를 사용하기 위해 Redis Client를 반환합니다.
   */
  public getClient(): Redis {
    return this.redis;
  }

  /**
   * @description Redis에 Lock을 획득합니다. Lock을 획득하지 못할 경우, null을 반환합니다.
   * @param {string} key - Lock을 획득할 키입니다.
   * @returns {Promise<string>} lock 획득 여부를 반환합니다.
   */
  async setLock(key: string): Promise<string> {
    // Lock 획득
    const lock: string = await this.redis.set(key, 'LOCK', 'EX', this.LOCK_DURATION, 'NX');

    return lock;
  }

  /**
   * @description Redis에 Lock을 해제합니다.
   * @param {string} key - Lock을 해제할 키입니다.
   * @returns {Promise<void>}
   */
  async unLock(key: string): Promise<void> {
    // Lock 해제
    await this.redis.del(key);
  }

  /**
   * @description Redis에 저장된 최근 스피또 회차 정보를 가져옵니다.
   * @param {number} speettoType - 스피또 타입입니다. (500 / 1000 / 2000)
   * @returns {SpeettoInfoInterface} 최근 스피또 회차 정보를 반환합니다.
   */
  async getRecentlySpettoInfo(speettoType: number): Promise<SpeettoInfoInterface> {
    const speettoInfo: SpeettoInfoInterface = JSON.parse(await this.redis.get(`speetto${speettoType}Info`));

    return speettoInfo;
  }

  /**
   * @description Redis에 저장된 최근 로또 회차 번호를 가져옵니다.
   * @returns {number} 최근 로또 회차 번호를 반환합니다.
   */
  async getRecentlyLottoDrwNo(): Promise<number> {
    const recentlyDrwNo: number = Number(await this.redis.get('drwNo'));

    return recentlyDrwNo;
  }

  /**
   * @description Redis에 저장된 최근 로또 회차 당첨 정보를 가져옵니다.
   * @returns {LottoInfoInterface} 최근 로또 회차 당첨 정보
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
   * @description Redis에 저장된 최근 로또 통계 정보를 가져옵니다.
   * @returns {LottoStatisticInfoInterface} 최근 로또 통계 정보
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
   * @description Redis에 저장된 최근 로또 당첨금 정보를 가져옵니다.
   * @returns {LottoHighestPrizeInfoInterface} 최근 로또 당첨금 정보
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

  /**
   * @description userEmail을 키로 하여 인증 코드를 Redis에 저장합니다.
   * @param {string} userEmail - 인증 코드를 저장할 이메일입니다.
   * @param {number} ttl - 인증 코드의 유효 기간(초)입니다.
   * @returns {Promise<string>} 생성된 인증 코드를 반환합니다.
   */
  async setVerificationCode(userEmail: string, ttl: number): Promise<string> {
    // 랜덤한 6자리 숫자 코드를 생성합니다.
    const verificationCode: string = Math.floor(100000 + Math.random() * 900000).toString();

    // Redis에 이메일과 인증 코드를 저장합니다.
    await this.redis.set(userEmail, verificationCode, 'EX', ttl);

    return verificationCode;
  }

  /**
   * @description Redis에 저장된 인증 코드를 가져옵니다.
   * @param {string} userEmail - 인증 코드를 가져올 이메일입니다.
   * @returns {Promise<string>} Redis에 저장된 인증 코드를 반환합니다.
   */
  async getVerificationCode(userEmail: string): Promise<string> {
    // Redis에서 이메일에 알맞는 인증 코드를 가져옵니다.
    const verificationCode: string = await this.redis.get(userEmail);

    return verificationCode;
  }
}
