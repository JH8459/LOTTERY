import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InputEmailDto {
  @ApiProperty({ required: true, description: '이메일 주소' })
  @IsNotEmpty({ message: '이메일 주소는 필수입니다.' })
  @IsEmail({}, { message: '이메일 주소 형식이 올바르지 않습니다.' })
  emailInfo: string;
}
