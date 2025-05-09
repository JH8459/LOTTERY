import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LottoRedisRepository } from './repository/lotto.redis.repository';
import { SpeettoRedisRepository } from './repository/speetto.redis.repository';
import { RedisLockService } from './util/redisLock.service';
import { VerificationRedisRepository } from './repository/verification.redis.repository';

@Global()
@Module({
  providers: [
    RedisService,
    RedisLockService,
    LottoRedisRepository,
    SpeettoRedisRepository,
    VerificationRedisRepository,
  ],
  exports: [RedisService, RedisLockService, LottoRedisRepository, SpeettoRedisRepository, VerificationRedisRepository],
})
export class RedisModule {}
