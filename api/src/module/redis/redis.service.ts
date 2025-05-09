import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * @description RedisService는 Redis와의 저수준 상호작용을 처리하는 서비스 클래스입니다.
 * Redis 명령어(`get`, `set`, `mget`, `del`)를 추상화하여 제공합니다.
 * 도메인 지식 없이 Redis 작업만 책임집니다.
 * @constructor
 * @param {Redis} redis - Redis Client 인스턴스입니다.
 */
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * @description ioredis의 원시 메서드 사용이 필요한 경우 사용합니다.
   * @returns {Redis} Redis Client 인스턴스를 반환합니다.
   */
  public getClient(): Redis {
    return this.redis;
  }

  /**
   * @description 주어진 키에 대한 값을 조회합니다.
   * @param {string} key - 조회할 Redis 키
   * @returns {Promise<string | null>} 조회된 문자열 값 또는 null
   */
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  /**
   * @description 여러 개의 키에 대한 값을 한 번에 조회합니다.
   * @param {string[]} keys - 조회할 키 배열
   * @returns {Promise<(string | null)[]>} 키 순서에 맞는 값 배열 (존재하지 않는 키는 null)
   */
  async mget(keys: string[]): Promise<(string | null)[]> {
    return await this.redis.mget(...keys);
  }

  /**
   * @description Redis에 값을 저장합니다. 선택적으로 TTL(유효기간)을 설정할 수 있습니다.
   * @param {string} key - 저장할 키
   * @param {string} value - 저장할 값 (문자열)
   * @param {number} [ttlSeconds] - 설정할 TTL (초 단위). 생략 시 만료 없음
   * @returns {Promise<void>}
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  /**
   * @description 주어진 키를 Redis에서 삭제합니다.
   * @param {string} key - 삭제할 키
   * @returns {Promise<void>}
   */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
