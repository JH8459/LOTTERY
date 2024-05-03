import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SLACK } from './swagger/slack.swagger';
import { SlackService } from './slack.service';

@ApiTags('Slack API')
@Controller('/slack')
export class SlackController {
  constructor(private slackService: SlackService) {}

  @ApiOperation(SLACK.POST.API_OPERATION)
  @Post('/events')
  async slack(@Body('challenge') challenge: string): Promise<ResponseDto> {
    const result: ResponseDto = {
      message: 'success',
      data: challenge,
    };

    return result;
  }
}
