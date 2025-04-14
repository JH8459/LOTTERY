import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QnaService } from './qna.service';
import { QNA_SWAGGER } from './swagger/qna.swagger';
import { QnaRegistInfoDto } from './dto/qna.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('QNA API')
@Controller('/qna')
export class QnaController {
  constructor(private qnaService: QnaService) {}

  @ApiOperation(QNA_SWAGGER.POST.API_OPERATION)
  @ApiBody(QNA_SWAGGER.POST.API_BODY)
  @ApiResponse(QNA_SWAGGER.POST.API_OK_RESPONSE)
  @ApiResponse(QNA_SWAGGER.POST.API_BAD_REQUEST_RESPONSE)
  @Post('/')
  async requestQuestion(@Body() qnaRegistInfo: QnaRegistInfoDto): Promise<ResponseDto> {
    await this.qnaService.requestQuestion(qnaRegistInfo);

    const result: ResponseDto = {
      statusCode: HttpStatus.CREATED,
      message: '문의하기 성공',
    };

    return result;
  }
}
