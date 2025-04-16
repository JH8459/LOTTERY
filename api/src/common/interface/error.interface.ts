export interface ApiErrorResponsesOptions {
  status: number;
  description: string;
  content: {
    'application/json': {
      examples: {
        [exampleKey: string]: {
          summary: string;
          value: ErrorResponse;
        };
      };
    };
  };
}

export interface ErrorResponse {
  message: string;
  statusCode: 400 | 401 | 404 | 409 | 500;
}
