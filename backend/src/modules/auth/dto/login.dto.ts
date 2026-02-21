import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com', description: '이메일 주소' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({ example: 'Password1!', description: '비밀번호 (최소 8자)' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;
}
