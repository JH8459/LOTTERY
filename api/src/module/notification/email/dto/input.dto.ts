import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class InputEmailDto {
  @ApiProperty({ required: true, description: '이메일 주소' })
  @IsNotEmpty({ message: '이메일 주소는 필수입니다.' })
  @IsEmail({}, { message: '이메일 주소 형식이 올바르지 않습니다.' })
  emailInfo: string;
}

export class InputVerificationDto extends InputEmailDto {
  @ApiProperty({ required: true, description: '인증 코드' })
  @IsNotEmpty({ message: '인증 코드는 필수입니다.' })
  @Length(6, 6, { message: '인증 코드 형식이 올바르지 않습니다.' })
  verificationCode: string;
}
