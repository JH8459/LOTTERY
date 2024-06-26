import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';
import { Repository } from 'typeorm';
import { LottoInfoInterface } from '../../interface/lotto.interface';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { UserEntity } from 'src/entity/user.entity';
import { UserInfoDto } from '../dto/user.dto';
import { FeedbackEntity } from 'src/entity/feedback.entity';
import { SpeettoEntity } from 'src/entity/speetto.entity';
import { SpeettoInfoInterface } from '../../interface/speetto.interface';

@Injectable()
export class SlackRepository {
  constructor(
    @InjectRepository(LottoEntity) private readonly lottoModel: Repository<LottoEntity>,
    @InjectRepository(SpeettoEntity) private readonly speettoModel: Repository<SpeettoEntity>,
    @InjectRepository(WorkspaceEntity) private readonly workspaceModel: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
    @InjectRepository(FeedbackEntity) private readonly feedbackModel: Repository<FeedbackEntity>
  ) {}

  async getUserInfo(workspaceId: string, userId: string): Promise<UserInfoDto> {
    const userInfo: UserInfoDto = await this.userModel
      .createQueryBuilder('userEntity')
      .select([
        'userEntity.userIdx AS userIdx',
        'userEntity.workspaceIdx AS workspaceIdx',
        'workspaceEntity.workspaceId AS workspaceId',
        'userEntity.userId AS userId',
        'userEntity.isSubscribe AS isSubscribe',
      ])
      .innerJoin(WorkspaceEntity, 'workspaceEntity', 'workspaceEntity.workspaceIdx = userEntity.workspaceIdx')
      .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId })
      .andWhere('userEntity.userId = :userId', { userId })
      .getRawOne();

    return userInfo;
  }

  async getUserInfoByIdx(userIdx: number): Promise<UserInfoDto> {
    const userInfo: UserInfoDto = await this.userModel
      .createQueryBuilder('userEntity')
      .select([
        'userEntity.userIdx AS userIdx',
        'userEntity.workspaceIdx AS workspaceIdx',
        'workspaceEntity.workspaceId AS workspaceId',
        'userEntity.userId AS userId',
        'userEntity.isSubscribe AS isSubscribe',
      ])
      .innerJoin(WorkspaceEntity, 'workspaceEntity', 'workspaceEntity.workspaceIdx = userEntity.workspaceIdx')
      .where('userEntity.userIdx = :userIdx', { userIdx })
      .getRawOne();

    return userInfo;
  }

  async upsertSubscribeStatus(
    workspaceId: string,
    userId: string,
    isSubscribe: boolean,
    userAvail: Date
  ): Promise<number> {
    const { workspaceIdx } = await this.workspaceModel
      .createQueryBuilder('workspaceEntity')
      .select('workspaceEntity.workspaceIdx AS workspaceIdx')
      .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();

    const userInfo: UserEntity = await this.userModel
      .createQueryBuilder('userEntity')
      .select('userEntity.userIdx AS userIdx')
      .where('userEntity.userId = :userId', { userId })
      .andWhere('userEntity.workspaceIdx = :workspaceIdx', { workspaceIdx })
      .getRawOne();

    if (userInfo) {
      await this.userModel
        .createQueryBuilder('userEntity')
        .update(UserEntity)
        .set({ isSubscribe, userAvail })
        .where('userIdx = :userIdx', { userIdx: userInfo.userIdx })
        .execute();

      return userInfo.userIdx;
    } else {
      const userIdx: number = await this.userModel.manager.transaction(async (transactionalEntityManager) => {
        const { identifiers } = await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(UserEntity)
          .values({ workspaceIdx, userId, isSubscribe, userAvail })
          .execute();

        return identifiers[0].userIdx;
      });

      return userIdx;
    }
  }

  async insertFeedback(userIdx: number, feedbackContent: string): Promise<void> {
    await this.feedbackModel.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(FeedbackEntity)
        .values({ userIdx, feedbackContent })
        .execute();
    });
  }

  async saveAccessToken(workspaceName: string, workspaceId: string, accessToken: string): Promise<void> {
    const workspace = await this.workspaceModel
      .createQueryBuilder('workspaceEntity')
      .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();

    if (workspace) {
      await this.workspaceModel
        .createQueryBuilder('workspaceEntity')
        .update(WorkspaceEntity)
        .set({ workspaceName: workspaceName, accessToken: accessToken })
        .where('workspaceId = :workspaceId', { workspaceId })
        .execute();
    } else {
      await this.workspaceModel.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(WorkspaceEntity)
          .values({ workspaceName, workspaceId, accessToken })
          .execute();
      });
    }
  }

  async getAccessToken(workspaceId: string): Promise<string> {
    const { accessToken }: WorkspaceEntity = await this.workspaceModel
      .createQueryBuilder('workspaceEntity')
      .select('workspaceEntity.accessToken AS accessToken')
      .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();

    return accessToken;
  }

  async getRecentlyLottoDrwNo(): Promise<number> {
    const { drwNo }: LottoEntity = await this.lottoModel
      .createQueryBuilder('lottoEntity')
      .select('lottoEntity.drwNo AS drwNo')
      .orderBy('lottoEntity.drwNo', 'DESC')
      .getRawOne();

    return drwNo;
  }

  async getLottoInfo(drwNo: number): Promise<LottoInfoInterface> {
    const lottoInfo: LottoInfoInterface = await this.lottoModel
      .createQueryBuilder('lottoEntity')
      .select([
        'lottoEntity.drwNo AS drwNo',
        'lottoEntity.drwtNo1 AS drwtNo1',
        'lottoEntity.drwtNo2 AS drwtNo2',
        'lottoEntity.drwtNo3 AS drwtNo3',
        'lottoEntity.drwtNo4 AS drwtNo4',
        'lottoEntity.drwtNo5 AS drwtNo5',
        'lottoEntity.drwtNo6 AS drwtNo6',
        'lottoEntity.bnusNo AS bnusNo',
        'lottoEntity.firstWinamnt AS firstWinamnt',
        'lottoEntity.firstPrzwnerCo AS firstPrzwnerCo',
        'lottoEntity.secondWinamnt AS secondWinamnt',
        'lottoEntity.secondPrzwnerCo AS secondPrzwnerCo',
        'lottoEntity.thirdWinamnt AS thirdWinamnt',
        'lottoEntity.thirdPrzwnerCo AS thirdPrzwnerCo',
        'lottoEntity.drwNoDate AS drwNoDate',
      ])
      .where('lottoEntity.drwNo = :drwNo', { drwNo })
      .getRawOne();

    return lottoInfo;
  }

  async getSpeettoInfo(speettoType: number): Promise<SpeettoEntity> {
    const speettoInfo: SpeettoInfoInterface = await this.speettoModel
      .createQueryBuilder('speettoEntity')
      .select([
        'speettoEntity.drwNo AS drwNo',
        'speettoEntity.speettoType AS speettoType',
        'speettoEntity.firstPrizeDate AS firstPrizeDate',
        'speettoEntity.firstWinAmnt AS firstWinAmnt',
        'speettoEntity.firstWinCnt AS firstWinCnt',
        'speettoEntity.secondPrizeDate AS secondPrizeDate',
        'speettoEntity.secondWinAmnt AS secondWinAmnt',
        'speettoEntity.secondWinCnt AS secondWinCnt',
        'speettoEntity.thirdPrizeDate AS thirdPrizeDate',
        'speettoEntity.thirdWinAmnt AS thirdWinAmnt',
        'speettoEntity.thirdWinCnt AS thirdWinCnt',
        'speettoEntity.saleDate AS saleDate',
        'speettoEntity.saleRate AS saleRate',
      ])
      .where('speettoEntity.speettoType = :speettoType', { speettoType })
      .orderBy('speettoEntity.drwNo', 'DESC')
      .limit(1)
      .getRawOne();

    return speettoInfo;
  }
}
