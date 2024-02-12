import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SEND_EMAIL } from './swagger/email.swaager';
import { InputEmailDto } from './dto/inputEmail.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('Email API')
@Controller('/email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @ApiOperation(SEND_EMAIL.POST.API_OPERATION)
  @ApiBody(SEND_EMAIL.POST.API_BODY)
  @Post('test')
  async sendEmail(@Body() email: InputEmailDto): Promise<ResponseDto> {
    await this.emailService.sendEmail(email);

    const result: ResponseDto = {
      message: '이메일 발송 성공',
    };

    return result;
  }
}
