import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SlackService } from './slack.service';
import { SlackActionTypeEnum } from './constant/slack.enum';

@ApiTags('Slack API')
@Controller('/slack')
export class SlackController {
  constructor(private slackService: SlackService) {}

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
    const receiver = this.slackService.getReceiver();

    // receiver를 사용하여 command 요청을 처리합니다.
    await receiver.requestHandler(req, res);
  }

  @Post('/actions')
  async slackActionsHandler(@Req() req: Request, @Res() res: Response): Promise<void> {
    const bodyToJson = JSON.parse(req.body.payload);
    const ack = res.send.bind(res);
    const type: string = bodyToJson.type;

    switch (type) {
      // Block Actions 이벤트를 처리합니다.
      case SlackActionTypeEnum.BLOCK_ACTIONS:
        await this.slackService.slackBlockActionsHandler(bodyToJson);
        break;
      // View Submission 이벤트를 처리합니다.
      case SlackActionTypeEnum.VIEW_SUBMISSION:
        await this.slackService.slackViewSubMissionHandler(ack, bodyToJson);
        break;
      // 기타 이벤트는 무시합니다.
      default:
        break;
    }
  }
}
