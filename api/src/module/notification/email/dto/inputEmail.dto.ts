import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InputEmailDto {
  @ApiProperty({ required: true, description: '이메일 주소' })
  @IsNotEmpty()
  @IsEmail()
  emailInfo: string;
}
