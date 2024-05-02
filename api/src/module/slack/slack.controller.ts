import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SLACK } from './swagger/slack.swagger';

@ApiTags('Slack API')
@Controller('/slack')
export class SlackController {
  @ApiOperation(SLACK.POST.API_OPERATION)
  @Post('/events')
  async slack(): Promise<ResponseDto> {
    const result: ResponseDto = {
      message: 'HEALTH Check',
      data: new Date(),
    };

    return result;
  }
}
