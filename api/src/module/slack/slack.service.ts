import { Injectable } from '@nestjs/common';
import * as NestJSSlack from 'nestjs-slack';

@Injectable()
export class SlackService {
  constructor(private nestJSSlackService: NestJSSlack.SlackService) {}

  // async sendLottoEmailToSubscriberListScheduler(): Promise<void> {
  //   await this.emailService.sendLottoEmailToSubscriberList();
  // }
}
