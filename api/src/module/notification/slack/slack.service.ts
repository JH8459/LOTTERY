import { Injectable } from '@nestjs/common';
import { BoltService } from './bolt.service';

@Injectable()
export class SlackService {
  constructor(private readonly boltService: BoltService) {}

  async getSlackApp() {
    const app = this.boltService.getSlackApp();

    app.event('message', async ({ event }) => {
      console.log(event);
    });
  }
}
