import { IsEnum, IsUUID, IsOptional, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType } from '../../../database/entities/alert.entity';
import { ECallTriggerType } from '../../../database/entities/ecall.entity';

export class CreateECallDto {
  @ApiProperty({ enum: ECallTriggerType, description: '트리거 유형' })
  @IsEnum(ECallTriggerType)
  triggerType: ECallTriggerType;

  @ApiProperty({ description: '농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiPropertyOptional({ description: '작업자 ID' })
  @IsOptional()
  @IsUUID('4')
  workerId?: string;

  @ApiPropertyOptional({ description: '관련 알림 ID' })
  @IsOptional()
  @IsUUID('4')
  alertId?: string;

  @ApiPropertyOptional({ description: '위도' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ description: '경도' })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ description: '작업자 정보 스냅샷' })
  @IsOptional()
  @IsObject()
  workerInfo?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: AlertType, description: '사고유형' })
  @IsOptional()
  @IsEnum(AlertType)
  accidentType?: AlertType;
}
