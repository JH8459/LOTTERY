import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { LottoEntity } from 'src/entity/lotto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackRepository } from './repository/slack.repository';
import { CommandsService } from './util/commands/commands.service';
import { ActionsService } from './util/actions/actions.service';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity])],
  providers: [ActionsService, CommandsService, SlackService, SlackRepository],
  controllers: [SlackController],
})
export class SlackModule {}
