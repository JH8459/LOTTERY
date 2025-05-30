import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SlackService } from './slack.service';
import { SlackActionTypeEnum } from './constant/slack.enum';
import { SlackInteractionPayload } from './interface/payload.interface';

@ApiTags('Slack API')
@Controller('/slack')
export class SlackController {
  constructor(private slackService: SlackService) {}

  @Get('auth')
  async slackOAuthCallback(@Query('code') code: string, @Res() res: Response): Promise<void> {
    const url: string = await this.slackService.authorizeSlackCode(code);

    res.redirect(url);
  }

  @Post('/commands')
  async slackCommandHandler(@Req() req: Request, @Res() res: Response): Promise<void> {
    const receiver = this.slackService.getReceiver();

    // receiver를 사용하여 command 요청을 처리합니다.
    await receiver.requestHandler(req, res);
  }

  @Post('/actions')
  async slackActionsHandler(@Req() req: Request, @Res() res: Response): Promise<void> {
    const bodyToJson: SlackInteractionPayload = JSON.parse(req.body.payload);
    const ack = res.send.bind(res);
    const type: string = bodyToJson.type;

    if (type === SlackActionTypeEnum.BLOCK_ACTIONS) {
      // Block Actions 이벤트를 처리합니다.
      await this.slackService.slackBlockActionsHandler(ack, bodyToJson);
    }

    if (type === SlackActionTypeEnum.VIEW_SUBMISSION) {
      // View Submission 이벤트를 처리합니다.
      await this.slackService.slackViewSubMissionHandler(ack, bodyToJson);
    }
  }
}
