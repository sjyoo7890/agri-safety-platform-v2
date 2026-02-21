import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../database/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '김철수' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'NewPassword1!',
    description: '변경 시에만 전달',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
