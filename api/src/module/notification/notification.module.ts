import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [EmailModule],
  controllers: [NotificationController],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
