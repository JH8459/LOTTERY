import { IsNumber, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_log' })
export class UserLogEntity {
  @PrimaryGeneratedColumn({ name: 'user_log_idx', type: 'int' })
  userLogIdx: number;

  @IsNumber()
  @Column({ name: 'user_idx', type: 'int' })
  userIdx: number;

  @IsString()
  @Column({ name: 'log_type', type: 'varchar', length: 50 })
  logType: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'log_at', precision: null })
  logAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userLogRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_idx', referencedColumnName: 'userIdx' }])
  userIdxRelation: UserEntity;
}
