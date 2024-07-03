import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QnaService } from './qna.service';
import { QNA_SWAGGER } from './swagger/qna.swagger';
import { QnaRegistInfoDto } from './dto/qna.dto';

@ApiTags('QNA API')
@Controller('/qna')
export class QnaController {
  constructor(private qnaService: QnaService) {}

  @ApiOperation(QNA_SWAGGER.POST.API_OPERATION)
  @ApiBody(QNA_SWAGGER.POST.API_BODY)
  @Post('/')
  async requestQuestion(@Body() qnaRegistInfo: QnaRegistInfoDto): Promise<void> {
    console.log('✅ qnaRegistInfo: ', qnaRegistInfo);
    // const url: string = await this.qnaService.getAccessToken();
  }
}
