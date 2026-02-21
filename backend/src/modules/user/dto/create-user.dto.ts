import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../database/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: 'Password1!',
    description: '최소 8자, 영문 대소문자 + 숫자 + 특수문자 조합',
  })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.WORKER })
  @IsEnum(UserRole, { message: '유효하지 않은 역할입니다.' })
  role: UserRole;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID('4', { message: '유효한 농장 ID가 아닙니다.' })
  farmId?: string;
}
