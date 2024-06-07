import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CommonEntity } from 'src/common/entity/common.entity';

@Entity({ name: 'feedback' })
export class FeedbackEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'feedback_idx', type: 'int' })
  feedbackIdx: number;

  @IsNumber()
  @Column({ name: 'user_idx', type: 'int' })
  userIdx: number;

  @IsString()
  @Column({ name: 'feedback_content', type: 'text' })
  feedbackContent: string;

  @ManyToOne(() => UserEntity, (user) => user.feedbackRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_idx', referencedColumnName: 'userIdx' }])
  userIdxRelation: UserEntity;
}
