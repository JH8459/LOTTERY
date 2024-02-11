import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email/email.service';

@ApiTags('Notification API')
@Controller('/email')
export class NotificationController {
  constructor(private emailService: EmailService) {}

  @Get()
  async sendEmail(): Promise<ResponseDto> {
    await this.emailService.sendEmail();

    const result: ResponseDto = {
      message: 'EMAIL TEST',
    };

    return result;
  }
}
