import { IsEnum, IsUUID, IsString, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccidentType, AccidentSeverity } from '../../../database/entities/accident.entity';

export class CreateAccidentDto {
  @ApiProperty({ enum: AccidentType, description: '사고유형' })
  @IsEnum(AccidentType)
  type: AccidentType;

  @ApiProperty({ enum: AccidentSeverity, description: '심각도' })
  @IsEnum(AccidentSeverity)
  severity: AccidentSeverity;

  @ApiProperty({ description: '발생 일시' })
  @IsDateString()
  occurredAt: string;

  @ApiProperty({ description: '농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiPropertyOptional({ description: '작업장 ID' })
  @IsOptional()
  @IsUUID('4')
  workplaceId?: string;

  @ApiPropertyOptional({ description: '작업자 ID' })
  @IsOptional()
  @IsUUID('4')
  workerId?: string;

  @ApiPropertyOptional({ description: '사고 경위' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '원인 분석' })
  @IsOptional()
  @IsString()
  cause?: string;

  @ApiPropertyOptional({ description: '조치사항' })
  @IsOptional()
  @IsString()
  actionsTaken?: string;

  @ApiPropertyOptional({ description: '아차사고 여부' })
  @IsOptional()
  @IsBoolean()
  isNearMiss?: boolean;

  @ApiPropertyOptional({ description: '첨부파일 URL 목록' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
