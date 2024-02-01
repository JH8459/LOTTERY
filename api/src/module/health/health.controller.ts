import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check API')
@Controller('/health')
export class HealthController {
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
