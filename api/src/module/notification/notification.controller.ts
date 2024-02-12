import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email/email.service';
import { SEND_EMAIL } from './swagger/notification.swaager';
import { InputEmailDto } from './dto/inputEmail.dto';

@ApiTags('Notification API')
@Controller('/email')
export class NotificationController {
  constructor(private emailService: EmailService) {}

  @ApiOperation(SEND_EMAIL.POST.API_OPERATION)
  @ApiBody(SEND_EMAIL.POST.API_BODY)
  @Post('test')
  async sendEmail(@Body() emailInfo: InputEmailDto): Promise<ResponseDto> {
    console.log('✅ emailInfo: ', emailInfo);

    await this.emailService.sendEmail(emailInfo.emailInfo);

    const result: ResponseDto = {
      message: '이메일 발송 성공',
    };

    return result;
  }
}
