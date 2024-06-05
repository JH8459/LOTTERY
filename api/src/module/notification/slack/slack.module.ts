import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { LottoEntity } from 'src/entity/lotto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackRepository } from './repository/slack.repository';
import { BuilderService } from './builder.service';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { UserEntity } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LottoEntity, WorkspaceEntity, UserEntity])],
  providers: [SlackService, SlackRepository, BuilderService],
  controllers: [SlackController],
})
export class SlackModule {}
