export const BadRequestError: ErrorType = {
  NAME: {
    message: '성함은 100자 이내로 입력해주세요.',
    error: 'Bad Request',
    statusCode: 400,
  },
  EMAIL: {
    message: '이메일은 200자 이내로 입력해주세요.',
    error: 'Bad Request',
    statusCode: 400,
  },
};
