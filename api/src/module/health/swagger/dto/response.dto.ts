import { ApiProperty } from '@nestjs/swagger';

export class ApiOKResponseDto {
  @ApiProperty({
    description: '응답 메시지',
    example: 'API HEALTHY 💪',
  })
  message: string;

  @ApiProperty({
    description: '현재 시간',
    example: new Date(),
  })
  data: Date;
}
