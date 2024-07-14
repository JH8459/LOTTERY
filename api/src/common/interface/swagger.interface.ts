import { ApiBodyOptions, ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export interface SwaggerMethod {
  GET?: {
    API_OPERATION: ApiOperationOptions;
    API_OK_RESPONSE: ApiResponseOptions;
    API_BAD_REQUEST_RESPONSE?: ApiErrorResponsesOptions;
    API_INTERNAL_SERVER_ERROR_RESPONSE?: ApiErrorResponsesOptions;
  };

  POST?: {
    API_OPERATION: ApiOperationOptions;
    API_BODY: ApiBodyOptions;
    API_OK_RESPONSE: ApiResponseOptions;
    API_BAD_REQUEST_RESPONSE?: ApiErrorResponsesOptions;
    API_INTERNAL_SERVER_ERROR_RESPONSE?: ApiErrorResponsesOptions;
  };
}
