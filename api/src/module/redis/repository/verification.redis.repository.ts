import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';

/**
 * @description VerificationRedisRepository는 사용자 이메일을 기반으로 Redis에 인증 코드를 저장하고 조회하는 기능을 제공합니다.
 * RedisService를 이용하여 인증 코드의 TTL(유효 시간)을 설정할 수 있으며, 문자열로 관리됩니다.
 * @constructor
 * @param {RedisService} redisService - RedisService 인스턴스입니다.
 */
@Injectable()
export class VerificationRedisRepository {
  constructor(private readonly redisService: RedisService) {}

  /**
   * @description 사용자 이메일을 키로 하여 인증 코드를 Redis에 저장합니다.
   * 6자리 숫자 코드를 랜덤으로 생성하며, TTL(초 단위)을 설정할 수 있습니다.
   * @param {string} userEmail - 인증 코드를 저장할 대상 이메일 주소
   * @param {number} ttl - 인증 코드의 유효 시간 (초 단위)
   * @returns {Promise<string>} 생성된 인증 코드
   */
  async setVerificationCode(userEmail: string, ttl: number): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(userEmail, code, ttl);

    return code;
  }

  /**
   * @description 사용자 이메일에 해당하는 인증 코드를 Redis에서 조회합니다.
   * @param {string} userEmail - 인증 코드를 조회할 대상 이메일 주소
   * @returns {Promise<string>} Redis에 저장된 인증 코드 (없을 경우 빈 문자열 반환)
   */
  async getVerificationCode(userEmail: string): Promise<string> {
    return (await this.redisService.get(userEmail)) ?? '';
  }
}
