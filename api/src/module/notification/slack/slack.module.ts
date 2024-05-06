import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { LottoEntity } from 'src/entity/lotto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackRepository } from './repository/slack.repository';
import { PrizeInfoService } from './util/commands/prizeInfo.service';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity])],
  providers: [PrizeInfoService, SlackService, SlackRepository],
  controllers: [SlackController],
})
export class SlackModule {}
