import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from '../notification/email/email.service';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SchedulerService, EmailService],
})
export class SchedulerModule {}
