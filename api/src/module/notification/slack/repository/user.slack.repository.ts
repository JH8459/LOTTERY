import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { InsertQueryBuilder, InsertResult, Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { UserInfoDto } from '../dto/user.dto';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { SUBSCRIBE_TYPE } from 'src/common/constant/enum';

/**
 * @description UserSlackRepository는 "/구독" 명령어를 통해 접근한 유저의 정보를 조회 및 저장하는 클래스입니다.
 * 유저 관련 데이터를 DB에서 조회 및 저장하고 원하는 포맷으로 사용할 수 있도록 제공합니다.
 * @constructor
 * @param {Repository<UserEntity>} userModel - 유저 정보를 관리하는 TypeORM Repository입니다.
 */
@Injectable()
export class UserSlackRepository {
  constructor(@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>) {}

  /**
   * @description Slack 사용자 정보를 조회합니다.
   * userIdx 또는 workspaceId + userId 조건 중 하나로 조회가 가능합니다.
   * @param {object} params - 사용자 조회 조건
   * @param {string} [params.workspaceId] - 슬랙 워크스페이스 ID
   * @param {string} [params.userId] - 슬랙 사용자 ID
   * @param {number} [params.userIdx] - 내부 사용자 고유 IDX
   * @returns {Promise<UserInfoDto>} 사용자 정보 DTO
   */
  async getUserInfo(params: { workspaceId?: string; userId?: string; userIdx?: number }): Promise<UserInfoDto> {
    const userInfoQueryBuilder: SelectQueryBuilder<UserEntity> = this.userModel
      .createQueryBuilder('userEntity')
      .select([
        'userEntity.userIdx AS userIdx',
        'userEntity.workspaceIdx AS workspaceIdx',
        'workspaceEntity.workspaceId AS workspaceId',
        'userEntity.userId AS userId',
        'userEntity.userEmail AS userEmail',
        'userEntity.isSlackSubscribe AS isSlackSubscribe',
        'userEntity.isEmailSubscribe AS isEmailSubscribe',
      ])
      .innerJoin(WorkspaceEntity, 'workspaceEntity', 'workspaceEntity.workspaceIdx = userEntity.workspaceIdx');

    if (params.userIdx) {
      userInfoQueryBuilder.where('userEntity.userIdx = :userIdx', { userIdx: params.userIdx });
    } else if (params.workspaceId && params.userId) {
      userInfoQueryBuilder
        .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId: params.workspaceId })
        .andWhere('userEntity.userId = :userId', { userId: params.userId });
    }

    const userInfo: UserInfoDto = await userInfoQueryBuilder.getRawOne();

    return userInfo;
  }

  /**
   * @description 사용자 구독 상태를 등록하거나 수정합니다. 사용자 정보가 없으면 새로 등록합니다.
   * @param {UserInfoDto} userInfo - 기존 사용자 정보
   * @param {number} workspaceIdx - 워크스페이스 고유 IDX
   * @param {string} userId - 사용자 ID
   * @param {SUBSCRIBE_TYPE} subscribeType - 구독 종류 (SLACK 또는 EMAIL)
   * @param {boolean} isSubscribe - 구독 여부
   * @param {string} [userEmail] - 이메일 구독 시 이메일 주소
   * @returns {Promise<number>} 처리된 사용자 고유 ID
   */
  async upsertSubscribeStatus(
    userInfo: UserInfoDto,
    workspaceIdx: number,
    userId: string,
    subscribeType: SUBSCRIBE_TYPE,
    isSubscribe: boolean,
    userEmail?: string
  ): Promise<number> {
    if (userInfo) {
      const updateQueryBuilder: UpdateQueryBuilder<UserEntity> = this.userModel
        .createQueryBuilder('userEntity')
        .update(UserEntity);

      if (subscribeType === SUBSCRIBE_TYPE.SLACK) {
        updateQueryBuilder.set({ isSlackSubscribe: isSubscribe });
      } else {
        updateQueryBuilder.set({ isEmailSubscribe: isSubscribe, userEmail: userEmail });
      }

      await updateQueryBuilder.where('userIdx = :userIdx', { userIdx: userInfo.userIdx }).execute();

      return userInfo.userIdx;
    } else {
      const insertQueryBuilder: InsertQueryBuilder<UserEntity> = this.userModel
        .createQueryBuilder('userEntity')
        .insert()
        .into(UserEntity);

      if (subscribeType === SUBSCRIBE_TYPE.SLACK) {
        insertQueryBuilder.values({ workspaceIdx, userId, isSlackSubscribe: isSubscribe });
      } else {
        insertQueryBuilder.values({ workspaceIdx, userId, userEmail, isEmailSubscribe: isSubscribe });
      }

      const insertResult: InsertResult = await insertQueryBuilder.execute();

      return insertResult.identifiers[0].userIdx;
    }
  }
}
