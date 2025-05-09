import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';

/**
 * @description RedisLockService는 분산 락 획득 및 해제를 위한 유틸리티입니다.
 * 기본적으로 NX + EX 옵션을 활용하여 단일 Lock을 제공합니다.
 * @constructor
 * @param {RedisService} redisService - RedisService 인스턴스입니다.
 * @property {number} LOCK_DURATION - 기본 Lock 지속 시간 (초 단위)
 */
@Injectable()
export class RedisLockService {
  private readonly LOCK_DURATION = 60 * 5; // 5분

  constructor(private readonly redisService: RedisService) {}

  /**
   * @description Redis에 Lock을 획득합니다. 이미 Lock이 존재하면 null을 반환합니다.
   * @param {string} key - Lock을 설정할 Redis 키
   * @param {number} [ttl] - TTL (초) - 생략 시 기본 5분
   * @returns {Promise<boolean>} Lock 획득 성공 여부
   */
  async setLock(key: string, ttl: number = this.LOCK_DURATION): Promise<boolean> {
    const result = await this.redisService.getClient().set(key, 'LOCK', 'EX', ttl, 'NX');

    return result === 'OK';
  }

  /**
   * @description Redis에 설정된 Lock을 해제합니다.
   * @param {string} key - 해제할 Lock 키
   * @returns {Promise<void>}
   */
  async unLock(key: string): Promise<void> {
    await this.redisService.del(key);
  }
}
