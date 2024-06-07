import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { LottoEntity } from 'src/entity/lotto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackRepository } from './repository/slack.repository';
import { BuilderService } from './service/builder.service';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { UserEntity } from 'src/entity/user.entity';
import { CommandService } from './service/command.service';
import { ActionService } from './service/action.service';
import { ViewSubmissionService } from './service/viewSubmission.service';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity, WorkspaceEntity, UserEntity])],
  providers: [SlackService, SlackRepository, BuilderService, CommandService, ActionService, ViewSubmissionService],
  controllers: [SlackController],
})
export class SlackModule {}
