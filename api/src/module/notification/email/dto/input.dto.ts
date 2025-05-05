import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { BadRequestError } from '../error/400.error';

export class InputEmailDto {
  @ApiProperty({ required: true, description: '이메일 주소' })
  @IsNotEmpty({ message: BadRequestError.EMAIL_EMPTY.message })
  @IsEmail({}, { message: BadRequestError.EMAIL_INVALID.message })
  emailInfo: string;
}

export class InputVerificationDto extends InputEmailDto {
  @ApiProperty({ required: true, description: '인증 코드' })
  @IsNotEmpty({ message: BadRequestError.VERIFICATION_CODE_EMPTY.message })
  @Length(6, 6, { message: BadRequestError.VERIFICATION_CODE_INVALID.message })
  verificationCode: string;
}
