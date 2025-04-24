import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { QnaRepository } from './repository/qna.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaEntity } from 'src/entity/qna.entity';
import { SlackModule } from '../notification/slack/slack.module';

@Module({
  imports: [TypeOrmModule.forFeature([QnaEntity]), SlackModule],
  providers: [QnaService, QnaRepository],
  controllers: [QnaController],
})
export class QnaModule {}
