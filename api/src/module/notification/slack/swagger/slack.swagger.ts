import { ApiOperationOptions } from '@nestjs/swagger';

export const SLACK = {
  POST: {
    API_OPERATION: {
      summary: 'SLACK',
      description: 'Slack API',
    } as ApiOperationOptions,
  },
};
