import { Injectable } from '@nestjs/common';
import { CommandService } from '../util/command.service';
import { App } from '@slack/bolt';

@Injectable()
/**
 * @description: CommandHandler는 Slack App의 Command를 처리하는 핸들러 클래스입니다. (Command 등록 책임을 가지고 있습니다.)
 * @constructor
 * @param {CommandService} commandService - CommandService 인스턴스입니다.
 * @Method registerCommandHandler - Slack App의 Command를 처리하는 메서드입니다.
 * @param {App} app - Slack App 인스턴스입니다.
 * @returns {Promise<void>}
 */
export class CommandHandler {
  constructor(private readonly commandService: CommandService) {}

  /**
   * @description: Slack App 인스턴스에 커맨드 핸들러를 등록하는 메서드입니다.
   * @param {App} app - Slack App 인스턴스입니다.
   * @returns {Promise<void>}
   */
  public async registerCommandHandler(app: App): Promise<void> {
    app.command('/로또', async ({ command, ack }) => {
      await ack();
      await this.commandService.lottoPrizeInfoCommandHandler(command);
    });

    app.command('/스피또', async ({ command, ack }) => {
      await ack();
      await this.commandService.speettoPrizeInfoCommandHandler(command);
    });

    app.command('/구독', async ({ command, ack }) => {
      await ack();
      await this.commandService.subscribeCommandHandler(command);
    });
  }
}
