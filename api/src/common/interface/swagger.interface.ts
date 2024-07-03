import { ApiBodyOptions, ApiOperationOptions } from '@nestjs/swagger';

export interface SwaggerMethod {
  GET?: {
    API_OPERATION: ApiOperationOptions;
  };

  POST?: {
    API_OPERATION: ApiOperationOptions;
    API_BODY: ApiBodyOptions;
  };
}
