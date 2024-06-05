import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';
import { Repository } from 'typeorm';
import { LottoInfoInterface } from '../../interface/lotto.interface';
import { WorkspaceEntity } from 'src/entity/workspace.entity';

@Injectable()
export class SlackRepository {
  constructor(
    @InjectRepository(LottoEntity) private readonly lottoModel: Repository<LottoEntity>,
    @InjectRepository(WorkspaceEntity) private readonly workspaceModel: Repository<WorkspaceEntity>
  ) {}

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
      await this.workspaceModel
        .createQueryBuilder('workspaceEntity')
        .insert()
        .into(WorkspaceEntity)
        .values({ workspaceName, workspaceId, accessToken })
        .execute();
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

  async getRecentlyDrwNo(): Promise<number> {
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
}
