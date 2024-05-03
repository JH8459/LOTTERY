import { Injectable } from '@nestjs/common';
import { BoltService } from './bolt.service';

@Injectable()
export class SlackService {
  constructor(private readonly boltService: BoltService) {}
}
