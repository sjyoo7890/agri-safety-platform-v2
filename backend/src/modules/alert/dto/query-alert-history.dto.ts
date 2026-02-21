import { IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType, AlertSeverity, AlertStatus } from '../../../database/entities/alert.entity';

export class QueryAlertHistoryDto {
  @ApiPropertyOptional({ description: '시작일' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: '종료일' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ enum: AlertType, description: '사고유형 필터' })
  @IsOptional()
  @IsEnum(AlertType)
  type?: AlertType;

  @ApiPropertyOptional({ enum: AlertSeverity, description: '위험등급 필터' })
  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @ApiPropertyOptional({ enum: AlertStatus, description: '상태 필터' })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @ApiPropertyOptional({ description: '농가 ID 필터' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;
}
