import { SwaggerMethod } from 'src/common/interface/swagger.interface';

export const HEALTH_SWAGGER: SwaggerMethod = {
  GET: {
    API_OPERATION: {
      summary: 'HEALTH CHECK',
      description: '200 CODE 응답 여부를 확인하는 HEALTH CHECK API',
    },
  },
};
