import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { SpeettoInfoInterface } from 'src/common/interface/speetto.interface';

/**
 * @description SpeettoRedisRepository는 Redis에 저장된 스피또 관련 데이터를 조회하는 역할을 합니다.
 * RedisService를 이용하여 키 기반 조회를 수행하고, 파싱 로직을 포함합니다.
 * @constructor
 * @param {RedisService} redisService - RedisService 인스턴스입니다.
 */
@Injectable()
export class SpeettoRedisRepository {
  constructor(private readonly redisService: RedisService) {}

  /**
   * @description Redis에 저장된 최근 스피또 회차 정보를 가져옵니다.
   * @param {number} type - 스피또 유형 (예: 500, 1000, 2000)
   * @returns {Promise<SpeettoInfoInterface>} 스피또 회차 정보 객체
   */
  async getRecentlySpettoInfo(type: number): Promise<SpeettoInfoInterface> {
    const key = `speetto${type}Info`;
    const value = await this.redisService.get(key);

    return JSON.parse(value ?? '{}');
  }
}
