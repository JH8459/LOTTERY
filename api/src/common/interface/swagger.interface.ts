import {
  ApiBodyOptions,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';

/**
 * @description API 메소드 옵션을 정의하는 인터페이스입니다.
 * @interface
 * @property {ApiOperationOptions} API_OPERATION - API 작업 옵션
 * @property {ApiParamOptions} [API_PARAM1] - 첫 번째 API Param 옵션
 * @property {ApiParamOptions} [API_PARAM2] - 두 번째 API Param 옵션
 * @property {ApiQueryOptions} [API_QUERY1] - 첫 번째 API Query 옵션
 * @property {ApiQueryOptions} [API_QUERY2] - 두 번째 API Query 옵션
 * @property {ApiBodyOptions} [API_BODY] - API Body 옵션
 * @property {ApiResponseOptions} [API_OK_RESPONSE] - 200 응답 옵션
 * @property {ApiResponseOptions} [API_BAD_REQUEST_RESPONSE] - 400 응답 옵션
 * @property {ApiResponseOptions} [API_UNAUTHORIZED_RESPONSE] - 401 응답 옵션
 * @property {ApiResponseOptions} [API_FORBIDDEN_RESPONSE] - 403 응답 옵션
 * @property {ApiResponseOptions} [API_NOT_FOUND_RESPONSE] - 404 응답 옵션
 * @property {ApiResponseOptions} [API_CONFLICT_RESPONSE] - 409 응답 옵션
 * @property {ApiResponseOptions} [API_INTERNEL_SERVER_ERR_RESPONSE] - 500 응답 옵션
 */
interface ApiMethodOptions {
  API_OPERATION: ApiOperationOptions;
  API_PARAM1?: ApiParamOptions;
  API_PARAM2?: ApiParamOptions;
  API_QUERY1?: ApiQueryOptions;
  API_QUERY2?: ApiQueryOptions;
  API_BODY?: ApiBodyOptions;
  API_OK_RESPONSE?: ApiResponseOptions;
  API_BAD_REQUEST_RESPONSE?: ApiResponseOptions;
  API_UNAUTHORIZED_RESPONSE?: ApiResponseOptions;
  API_FORBIDDEN_RESPONSE?: ApiResponseOptions;
  API_NOT_FOUND_RESPONSE?: ApiResponseOptions;
  API_CONFLICT_RESPONSE?: ApiResponseOptions;
  API_INTERNEL_SERVER_ERR_RESPONSE?: ApiResponseOptions;
}

/**
 * @description POST 메소드의 API 옵션을 정의하는 인터페이스입니다.
 * @interface
 * @extends ApiMethodOptions
 * @property {ApiResponseOptions} [API_CREATED_RESPONSE] - 201 응답 옵션
 */
interface ApiPostMethodOptions extends ApiMethodOptions {
  API_CONSUMES?: string;
  API_CREATED_RESPONSE?: ApiResponseOptions;
}

export interface SwaggerMethod {
  POST?: ApiPostMethodOptions;
  GET?: ApiMethodOptions;
  PUT?: ApiMethodOptions;
  PATCH?: ApiMethodOptions;
  DELETE?: ApiMethodOptions;
}
