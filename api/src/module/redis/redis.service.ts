import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private redis: Redis) {}

  // Lock 유지 시간 (5분)
  private readonly lockDuration = 60 * 5;

  async setLock(key: string): Promise<string> {
    // Lock 획득
    const lock: string = await this.redis.set(key, 'LOCK', 'EX', this.lockDuration, 'NX');

    return lock;
  }

  async unLock(key: string): Promise<void> {
    // Lock 해제
    await this.redis.del(key);
  }
}
