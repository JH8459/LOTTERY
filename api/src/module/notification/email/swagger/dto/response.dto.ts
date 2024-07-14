import { ApiProperty } from '@nestjs/swagger';

export class ApiOKResponseDto {
  @ApiProperty({
    description: '응답 메시지',
    example: '이메일 발송 성공',
  })
  message: string;
}
