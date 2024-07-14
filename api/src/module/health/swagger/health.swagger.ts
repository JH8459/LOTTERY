import { SwaggerMethod } from 'src/common/interface/swagger.interface';
import { ApiOKResponseDto } from './dto/response.dto';

export const HEALTH_SWAGGER: SwaggerMethod = {
  GET: {
    API_OPERATION: {
      summary: 'HEALTH CHECK',
      description: '200 CODE 응답 여부를 확인하는 HEALTH CHECK API',
    },
    API_OK_RESPONSE: {
      status: 200,
      description: '응답 성공',
      type: ApiOKResponseDto,
    },
  },
};
