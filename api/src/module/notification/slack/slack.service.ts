import { Injectable } from '@nestjs/common';
import * as NestJSSlack from 'nestjs-slack';

@Injectable()
export class SlackService {
  constructor(private readonly nestJSSlackService: NestJSSlack.SlackService) {}
}
