import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { UserLogEntity } from './userLog.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'user_idx', type: 'int' })
  userIdx: number;

  @IsNumber()
  @Column({ name: 'workspace_idx', type: 'int' })
  workspaceIdx: number;

  @IsString()
  @Column({ name: 'user_id', type: 'varchar', length: 500 })
  userId: string;

  @IsString()
  @Column({ name: 'user_email', type: 'varchar', length: 100, nullable: true })
  userEmail: string;

  @IsBoolean()
  @Column({ name: 'is_slack_subscribe', type: 'boolean', default: false })
  isSlackSubscribe: boolean;

  @IsBoolean()
  @Column({ name: 'is_email_subscribe', type: 'boolean', default: false })
  isEmailSubscribe: boolean;

  @IsDate()
  @Column({ name: 'user_avail', type: 'datetime', nullable: true })
  userAvail: Date;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.userRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspace_idx', referencedColumnName: 'workspaceIdx' }])
  workspaceIdxRelation: WorkspaceEntity;

  @OneToMany(() => UserLogEntity, (userLog) => userLog.userIdxRelation)
  userLogRelation: UserLogEntity[];
}
