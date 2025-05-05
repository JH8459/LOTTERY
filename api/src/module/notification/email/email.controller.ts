import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { InputEmailDto } from './dto/input.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SEND_EMAIL_SWAGGER, SEND_VERIFICATION_EMAIL_SWAGGER } from './swagger/email.swaager';
import { RedisService } from 'src/module/redis/redis.service';

@ApiTags('Email API')
@Controller('/email')
export class EmailController {
  constructor(private readonly redisService: RedisService, private readonly emailService: EmailService) {}

  @ApiOperation(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_OPERATION)
  @ApiBody(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_BODY)
  @ApiResponse(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_OK_RESPONSE)
  @ApiBadRequestResponse(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_BAD_REQUEST_RESPONSE)
  @ApiResponse(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_INTERNEL_SERVER_ERR_RESPONSE)
  @Post('verification')
  async sendVerificationEmail(@Body() input: InputEmailDto): Promise<ResponseDto> {
    const verificationCode: string = await this.redisService.setVerificationCode(input.emailInfo, 60 * 60);

    await this.emailService.enqueueVerificationCodeEmail(input.emailInfo, verificationCode);

    const result: ResponseDto = {
      statusCode: HttpStatus.OK,
      message: '인증코드 이메일 발송 요청 성공',
    };

    return result;
  }

  @ApiOperation(SEND_EMAIL_SWAGGER.POST.API_OPERATION)
  @ApiResponse(SEND_EMAIL_SWAGGER.POST.API_OK_RESPONSE)
  @ApiResponse(SEND_EMAIL_SWAGGER.POST.API_INTERNEL_SERVER_ERR_RESPONSE)
  @Get()
  async sendSubscribersEmail(): Promise<ResponseDto> {
    await this.emailService.enqueueLottoEmailToSubscriberList();

    const result: ResponseDto = {
      statusCode: HttpStatus.OK,
      message: '뉴스레터 이메일 발송 요청 성공',
    };

    return result;
  }
}
