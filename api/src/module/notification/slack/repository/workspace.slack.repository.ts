import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { Repository } from 'typeorm';

/**
 * @description WorkspaceSlackRepository는 인증을 위한 워크스페이스 정보를 조회 및 저장하는 클래스입니다.
 * 워크스페이스에 관련 데이터를 DB에서 조회 및 저장하고 원하는 포맷으로 사용할 수 있도록 제공합니다.
 * @constructor
 * @param {Repository<WorkspaceEntity>} workspaceModel - 스피또 정보를 관리하는 TypeORM Repository입니다.
 */
@Injectable()
export class WorkspaceSlackRepository {
  constructor(@InjectRepository(WorkspaceEntity) private readonly workspaceModel: Repository<WorkspaceEntity>) {}

  async getWorkSpaceIdx(workspaceId: string): Promise<number> {
    const workspaceInfo: WorkspaceEntity = await this.workspaceModel
      .createQueryBuilder('workspaceEntity')
      .select(['workspaceEntity.workspaceIdx AS workspaceIdx'])
      .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();

    return workspaceInfo ? workspaceInfo.workspaceIdx : null;
  }

  async getAccessToken(workspaceId: string): Promise<string> {
    const { accessToken } = await this.workspaceModel
      .createQueryBuilder('workspaceEntity')
      .select('workspaceEntity.accessToken AS accessToken')
      .where('workspaceEntity.workspaceId = :workspaceId', { workspaceId })
      .getRawOne();

    return accessToken;
  }

  async upsertAccessToken(workspaceName: string, workspaceId: string, accessToken: string): Promise<void> {
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
        .createQueryBuilder()
        .insert()
        .into(WorkspaceEntity)
        .values({ workspaceName, workspaceId, accessToken })
        .execute();
    }
  }
}
