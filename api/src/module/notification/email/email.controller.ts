import { Body, Controller, Get, Ip, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { InputEmailDto } from './dto/inputEmail.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SEND_EMAIL_SWAGGER } from './swagger/email.swaager';

@ApiTags('Email API')
@Controller('/email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @ApiOperation(SEND_EMAIL_SWAGGER.GET.API_OPERATION)
  @Get()
  async sendSubscribersEmail(): Promise<ResponseDto> {
    await this.emailService.sendLottoEmailToSubscriberList();

    const result: ResponseDto = {
      message: '구독자 이메일 발송 성공',
    };

    return result;
  }

  @ApiOperation(SEND_EMAIL_SWAGGER.POST.API_OPERATION)
  @ApiBody(SEND_EMAIL_SWAGGER.POST.API_BODY)
  @Post('test')
  async sendTestEmail(@Body() { emailInfo }: InputEmailDto): Promise<ResponseDto> {
    await this.emailService.sendLottoEmail(emailInfo);

    const result: ResponseDto = {
      message: '샘플 이메일 발송 성공',
    };

    return result;
  }
}
