import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';
import { FeedbackEntity } from './feedback.entity';
import { CommonEntity } from 'src/common/entity/common.entity';

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

  @IsBoolean()
  @Column({ name: 'is_slack_subscribe', type: 'boolean', nullable: true })
  isSlackSubscribe: boolean;

  @IsBoolean()
  @Column({ name: 'is_email_subscribe', type: 'boolean', nullable: true })
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

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.userIdxRelation)
  feedbackRelation: FeedbackEntity[];
}
