import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CommonEntity } from 'src/common/entity/common.entity';

@Entity({ name: 'qna' })
export class QnaEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'qna_idx', type: 'int' })
  qnaIdx: number;

  @IsString()
  @Column({ name: 'name', nullable: true, length: 100 })
  name: string;

  @IsString()
  @Column({ name: 'email', length: 200 })
  email: string;

  @IsString()
  @Column({ name: 'question', type: 'text' })
  question: string;
}
