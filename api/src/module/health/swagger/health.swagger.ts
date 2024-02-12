import { ApiOperationOptions } from '@nestjs/swagger';

export const HEALTH = {
  GET: {
    API_OPERATION: {
      summary: 'HEALTH CHECK',
      description: '200 CODE 응답 여부를 확인하는 HEALTH CHECK API',
    } as ApiOperationOptions,
  },
};
