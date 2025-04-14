import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { InputEmailDto } from './dto/inputEmail.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SEND_EMAIL_SWAGGER } from './swagger/email.swaager';

@ApiTags('Email API')
@Controller('/email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @ApiOperation(SEND_EMAIL_SWAGGER.GET.API_OPERATION)
  @ApiResponse(SEND_EMAIL_SWAGGER.GET.API_OK_RESPONSE)
  @ApiResponse(SEND_EMAIL_SWAGGER.GET.API_INTERNEL_SERVER_ERR_RESPONSE)
  @Get()
  async sendSubscribersEmail(): Promise<ResponseDto> {
    await this.emailService.enqueueLottoEmailToSubscriberList();

    const result: ResponseDto = {
      statusCode: HttpStatus.OK,
      message: '큐에 이메일 발송 요청 성공',
    };

    return result;
  }

  @ApiOperation(SEND_EMAIL_SWAGGER.POST.API_OPERATION)
  @ApiBody(SEND_EMAIL_SWAGGER.POST.API_BODY)
  @ApiResponse(SEND_EMAIL_SWAGGER.POST.API_OK_RESPONSE)
  @ApiResponse(SEND_EMAIL_SWAGGER.POST.API_INTERNEL_SERVER_ERR_RESPONSE)
  @Post('test')
  async sendTestEmail(@Body() { emailInfo }: InputEmailDto): Promise<ResponseDto> {
    await this.emailService.enqueueLottoEmail(emailInfo);

    const result: ResponseDto = {
      statusCode: HttpStatus.OK,
      message: '큐에 이메일 발송 요청 성공',
    };

    return result;
  }
}
