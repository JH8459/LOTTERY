import { Injectable, OnModuleInit } from '@nestjs/common';
import { App } from '@slack/bolt';
import { SLACK_CONFIG } from 'src/config/slack.config';

@Injectable()
export class BoltService implements OnModuleInit {
  private app: App;

  onModuleInit() {
    this.app = new App(SLACK_CONFIG);
  }

  getSlackApp() {
    return this.app;
  }
}
