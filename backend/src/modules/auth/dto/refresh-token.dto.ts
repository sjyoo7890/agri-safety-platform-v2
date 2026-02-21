import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh Token (쿠키 미사용 시 body로 전달)' })
  @IsString()
  refreshToken: string;
}
