export const InternalServerError: ErrorType = {
  GITHUB: {
    message: '구독자에게 이메일 발송 중 오류가 발생했습니다.',
    error: 'Internal Server Error',
    statusCode: 500,
  },
  EMAIL: {
    message: '메일 전송에 실패했습니다.',
    error: 'Internal Server Error',
    statusCode: 500,
  },
};
