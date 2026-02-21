import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../database/entities/user.entity';

export class AuthUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT Access Token (15분)' })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
