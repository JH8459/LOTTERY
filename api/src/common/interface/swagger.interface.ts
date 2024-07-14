import { ApiBodyOptions, ApiOperationOptions, ApiResponseMetadata } from '@nestjs/swagger';

export interface SwaggerMethod {
  GET?: {
    API_OPERATION: ApiOperationOptions;
    API_RESPONSE: ApiResponseMetadata;
  };

  POST?: {
    API_OPERATION: ApiOperationOptions;
    API_BODY: ApiBodyOptions;
  };
}
