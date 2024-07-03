import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QnaService } from './qna.service';
import { QNA } from './swagger/qna.swagger';
import { QnaRegistInfoDto } from './dto/qna.dto';

@Controller('/qna')
export class QnaController {
  constructor(private qnaService: QnaService) {}

  @ApiTags('QNA API')
  @ApiOperation(QNA.POST.API_OPERATION)
  @ApiBody(QNA.POST.API_BODY)
  @Post('/')
  async requestQuestion(@Body() qnaRegistInfo: QnaRegistInfoDto): Promise<void> {
    console.log('✅ qnaRegistInfo: ', qnaRegistInfo);
    // const url: string = await this.qnaService.getAccessToken();
  }
}
