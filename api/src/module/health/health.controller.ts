import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HEALTH_SWAGGER } from './swagger/health.swagger';

@ApiTags('Health Check API')
@Controller('/health')
export class HealthController {
  @ApiOperation(HEALTH_SWAGGER.GET.API_OPERATION)
  @ApiResponse(HEALTH_SWAGGER.GET.API_OK_RESPONSE)
  @Get()
  async getHealth(): Promise<ResponseDto> {
    console.log('API HEALTHY 💪');

    const result: ResponseDto = {
      message: 'API HEALTHY 💪',
      data: new Date(),
    };

    return result;
  }
}
