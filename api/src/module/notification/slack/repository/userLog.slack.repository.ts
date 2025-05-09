import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LOG_TYPE_ENUM } from 'src/common/constant/enum';
import { UserLogEntity } from 'src/entity/userLog.entity';
import { Repository } from 'typeorm';

/**
 * @description UserLogSlackRepository는 "/구독" 명령어를 통해 접근한 유저들의 로그를 저장하는 클래스입니다.
 * @constructor
 * @param {Repository<UserLogEntity>} userLogModel - 로그 정보를 관리하는 TypeORM Repository입니다.
 */
@Injectable()
export class UserLogSlackRepository {
  constructor(@InjectRepository(UserLogEntity) private readonly userLogModel: Repository<UserLogEntity>) {}

  /**
   * @description 주어진 사용자 식별자와 로그 타입에 따라 로그를 저장합니다.
   * 추가적으로 설명(description)도 기록할 수 있습니다.
   * @param {number} userIdx - 사용자 고유 IDX
   * @param {LOG_TYPE_ENUM} logType - 로그 유형
   * @param {string} [description] - 로그에 대한 설명
   * @returns {Promise<void>}
   */
  async insertUserlog(userIdx: number, logType: LOG_TYPE_ENUM, description?: string): Promise<void> {
    await this.userLogModel
      .createQueryBuilder()
      .insert()
      .into(UserLogEntity)
      .values({ userIdx, logType, description })
      .execute();
  }
}
