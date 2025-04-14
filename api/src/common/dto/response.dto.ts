export class ResponseDto<T = any> {
  statusCode: number;
  message: string;
  data?: T; // 응답 데이터, 필요 시 추가

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
