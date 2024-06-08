import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.service';
import { SlackRepository } from './slack/repository/slack.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoEntity } from 'src/entity/lotto.entity';
import { BuilderService } from './slack/service/builder.service';
import { WorkspaceEntity } from 'src/entity/workspace.entity';
import { UserEntity } from 'src/entity/user.entity';
import { CommandService } from './slack/service/command.service';
import { ActionService } from './slack/service/action.service';
import { ViewSubmissionService } from './slack/service/viewSubmission.service';
import { FeedbackEntity } from 'src/entity/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LottoEntity, WorkspaceEntity, UserEntity, FeedbackEntity]),
    EmailModule,
    SlackModule,
  ],
  providers: [
    EmailService,
    SlackService,
    SlackRepository,
    BuilderService,
    CommandService,
    ActionService,
    ViewSubmissionService,
  ],
  exports: [EmailService],
})
export class NotificationsModule {}
