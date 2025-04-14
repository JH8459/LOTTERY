import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'emailQueue' })],
  providers: [EmailService, EmailProcessor],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
