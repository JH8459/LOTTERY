import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  async getHealth(): Promise<any> {
    console.log('API HEALTHY 💪');

    return new Date();
  }
}
