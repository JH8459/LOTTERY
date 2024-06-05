import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'workspace' })
export class WorkspaceEntity {
  @PrimaryGeneratedColumn({ name: 'workspace_idx', type: 'int' })
  workspaceIdx: number;

  @IsString()
  @Column({ name: 'workspace_name', length: 1000 })
  workspaceName: string;

  @IsString()
  @Column({ name: 'workspace_id', length: 500 })
  workspaceId: string;

  @IsString()
  @Column({ name: 'access_token', length: 500 })
  accessToken: string;

  @OneToMany(() => UserEntity, (user) => user.workspaceIdxRelation)
  userRelation: UserEntity[];
}