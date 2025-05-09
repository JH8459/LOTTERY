import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailService } from './email.service';
import { InputEmailDto, InputVerificationDto } from './dto/input.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SEND_EMAIL_SWAGGER, SEND_VERIFICATION_EMAIL_SWAGGER } from './swagger/email.swaager';
import { VerificationRedisRepository } from 'src/module/redis/repository/verification.redis.repository';

@ApiTags('Email API')
@Controller('/email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly verificationRedisRepository: VerificationRedisRepository
  ) {}

  @ApiOperation(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_OPERATION)
  @ApiBody(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_BODY)
  @ApiResponse(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_OK_RESPONSE)
  @ApiBadRequestResponse(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_BAD_REQUEST_RESPONSE)
  @ApiInternalServerErrorResponse(SEND_VERIFICATION_EMAIL_SWAGGER.POST.API_INTERNEL_SERVER_ERR_RESPONSE)
  @Post('verification')
  async sendVerificationEmail(@Body() input: InputEmailDto): Promise<ResponseDto> {
    const verificationCode: string = await this.verificationRedisRepository.setVerificationCode(
      input.emailInfo,
      60 * 60
    );

    await this.emailService.enqueueVerificationCodeEmail(input.emailInfo, verificationCode);

    const result: ResponseDto = {
      statusCode: HttpStatus.OK,
      message: '인증코드 이메일 발송 요청 성공',
    };

    return result;
  }

  @ApiOperation(SEND_EMAIL_SWAGGER.POST.API_OPERATION)
  @ApiBody(SEND_EMAIL_SWAGGER.POST.API_BODY)
  @ApiResponse(SEND_EMAIL_SWAGGER.POST.API_OK_RESPONSE)
  @ApiBadRequestResponse(SEND_EMAIL_SWAGGER.POST.API_BAD_REQUEST_RESPONSE)
  @ApiInternalServerErrorResponse(SEND_EMAIL_SWAGGER.POST.API_INTERNEL_SERVER_ERR_RESPONSE)
  @Post('send')
  async sendEmail(@Body() input: InputVerificationDto): Promise<ResponseDto> {
    await this.emailService.enqueueLottoEmail(input.emailInfo, input.verificationCode);

    const result: ResponseDto = {
      statusCode: HttpStatus.OK,
      message: '뉴스레터 이메일 발송 요청 성공',
    };

    return result;
  }
}
