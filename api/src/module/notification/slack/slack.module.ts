import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { LottoEntity } from 'src/entity/lotto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackRepository } from './repository/slack.repository';
import { BuilderService } from './util/builder/builder.service';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity])],
  providers: [SlackService, SlackRepository, BuilderService],
  controllers: [SlackController],
})
export class SlackModule {}
