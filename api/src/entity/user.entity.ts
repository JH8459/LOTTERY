import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_idx', type: 'int' })
  userIdx: number;

  @IsNumber()
  @Column('int', { name: 'workspace_idx' })
  workspaceIdx: number;

  @IsString()
  @Column({ name: 'user_id', length: 500 })
  userId: string;

  @IsBoolean()
  @Column({ name: 'is_subscribe', default: false })
  isSubscribe: boolean;

  @IsDate()
  @DeleteDateColumn({ name: 'user_avail', precision: null, type: 'datetime' })
  userAvail: Date | null;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.userRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspace_idx', referencedColumnName: 'workspaceIdx' }])
  workspaceIdxRelation: WorkspaceEntity;
}
