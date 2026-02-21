import { IsEnum, IsUUID, IsArray, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertSeverity, AlertType } from '../../../database/entities/alert.entity';

export class UpsertRecipientDto {
  @ApiProperty({ description: '농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiProperty({ description: '수신자 그룹명' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AlertSeverity, description: '대상 위험등급' })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiPropertyOptional({ enum: AlertType, description: '특정 사고유형 (null이면 전체)' })
  @IsOptional()
  @IsEnum(AlertType)
  alertType?: AlertType;

  @ApiProperty({ description: '수신자 사용자 ID 목록' })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @ApiPropertyOptional({ description: '119/112 외부기관 포함 여부' })
  @IsOptional()
  @IsBoolean()
  includeExternal?: boolean;
}
