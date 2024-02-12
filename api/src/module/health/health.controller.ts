import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HEALTH } from './swagger/health.swagger';

@ApiTags('Health Check API')
@Controller('/health')
export class HealthController {
  @ApiOperation(HEALTH.GET.API_OPERATION)
  @Get()
  async getHealth(): Promise<ResponseDto> {
    console.log('API HEALTHY 💪');

    const result: ResponseDto = {
      message: 'HEALTH Check',
      data: new Date(),
    };

    return result;
  }
}
