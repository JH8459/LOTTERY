import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';
import { Repository } from 'typeorm';
import { LottoInfoInterface } from '../../interface/lotto.interface';
import { SlackEntity } from 'src/entity/slack.entity';

@Injectable()
export class SlackRepository {
  constructor(
    @InjectRepository(LottoEntity) private readonly lottoModel: Repository<LottoEntity>,
    @InjectRepository(SlackEntity) private readonly slackModel: Repository<SlackEntity>
  ) {}

  async saveAccessToken(workspaceName: string, workspaceId: string, accessToken: string): Promise<void> {
    await this.slackModel
      .createQueryBuilder('slackEntity')
      .insert()
      .into(SlackEntity)
      .values({ workspaceName, workspaceId, accessToken })
      .orUpdate(['workspaceName', 'workspaceId', 'accessToken'], ['workspace_idx'])
      .execute();
  }

  async getAccessToken(workspaceId: string): Promise<string> {
    const { accessToken }: SlackEntity = await this.slackModel
      .createQueryBuilder('slackEntity')
      .select('slackEntity.accessToken AS accessToken')
      .where('slackEntity.workspaceId = :workspaceId', { workspaceId })
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
