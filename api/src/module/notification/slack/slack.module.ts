import { forwardRef, Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { LottoEntity } from 'src/entity/lotto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackRepository } from './repository/slack.repository';
import { BuilderService } from './util/builder.service';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { UserEntity } from 'src/entity/user.entity';
import { CommandService } from './util/command.service';
import { ActionService } from './util/action.service';
import { ViewSubmissionService } from './util/viewSubmission.service';
import { SlackMessageService } from './util/slackMessage.service';
import { SpeettoEntity } from 'src/entity/speetto.entity';
import { WebHookService } from './util/webhook.service';
import { BullModule } from '@nestjs/bull';
import { ClientService } from './util/client.service';
import { UserLogEntity } from 'src/entity/userLog.entity';
import { EmailModule } from '../email/email.module';
import { SlackAppFactory } from './config/slackAppFactory';
import { CommandHandler } from './handler/command.handler';
import { ActionHandler } from './handler/action.handler';
import { ViewSubmissionHandler } from './handler/viewSubmission.handler';
import { AuthService } from './util/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([LottoEntity, SpeettoEntity, WorkspaceEntity, UserEntity, UserLogEntity]),
    BullModule.registerQueue({ name: 'slackQueue' }),
    HttpModule,
    forwardRef(() => EmailModule),
  ],
  providers: [
    SlackAppFactory,
    SlackService,
    SlackRepository,
    BuilderService,
    CommandService,
    ActionService,
    ViewSubmissionService,
    WebHookService,
    SlackMessageService,
    ClientService,
    AuthService,
    CommandHandler,
    ActionHandler,
    ViewSubmissionHandler,
  ],
  controllers: [SlackController],
  exports: [SlackMessageService, WebHookService],
})
export class SlackModule {}
