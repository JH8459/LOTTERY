import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
  async slackEventHandler(@Body('challenge') challenge: string): Promise<ResponseDto> {
    const result: ResponseDto = {
      message: 'success',
      data: challenge,
    };

    return result;
  }

  @Post('/commands')
  async slackCommandHandler(@Req() req: Request, @Res() res: Response): Promise<void> {
    console.log('✅ req1: ', req);
    console.log('✅ res1: ', res);

    const receiver = this.slackService.getReceiver();

    // receiver를 사용하여 요청을 처리합니다.
    receiver.router.post('/commands', (req, res) => {
      console.log('✅ req2: ', req);
      console.log('✅ res2: ', res);

      // Slash command를 처리하는 로직을 등록합니다.
      this.slackService.getCommandsLotteryInfo();
    });
  }
}
