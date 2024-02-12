import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class InputEmailDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  emailInfo: string;
}
