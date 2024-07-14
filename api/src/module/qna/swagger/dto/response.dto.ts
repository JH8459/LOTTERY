import { ApiProperty } from '@nestjs/swagger';

export class ApiOKResponseDto {
  @ApiProperty({
    description: '응답 메시지',
    example: '문의하기 성공',
  })
  message: string;
}
