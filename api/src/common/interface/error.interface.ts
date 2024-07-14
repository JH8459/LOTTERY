interface ApiErrorResponsesOptions {
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

type ErrorType = {
  [key: string]: ErrorResponse;
};

interface ErrorResponse {
  message: string;
  error: 'Bad Request' | 'Not Found' | 'Internal Server Error';
  statusCode: 400 | 401 | 404 | 409 | 500;
}
