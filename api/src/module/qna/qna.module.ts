import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { QnaRepository } from './repository/qna.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaEntity } from 'src/entity/qna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QnaEntity])],
  providers: [QnaService, QnaRepository],
  controllers: [QnaController],
})
export class QnaModule {}
