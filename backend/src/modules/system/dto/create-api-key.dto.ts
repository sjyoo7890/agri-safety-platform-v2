import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ example: '농기계 제조사 A 연동', description: 'API 키 이름' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['192.168.1.0/24'], description: '허용 IP 목록' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedIps?: string[];

  @ApiPropertyOptional({ example: 1000, description: '시간당 요청 제한' })
  @IsOptional()
  @IsNumber()
  rateLimit?: number;

  @ApiPropertyOptional({ description: '만료일 (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
