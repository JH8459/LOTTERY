import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'slack' })
export class SlackEntity {
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
}