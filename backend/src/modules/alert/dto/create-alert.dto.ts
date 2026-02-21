import { IsEnum, IsUUID, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType, AlertSeverity } from '../../../database/entities/alert.entity';

export class CreateAlertDto {
  @ApiProperty({ enum: AlertType, description: '사고/알림 유형' })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ enum: AlertSeverity, description: '위험등급' })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

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

  @ApiProperty({ description: '알림 메시지' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'TTS용 메시지' })
  @IsOptional()
  @IsString()
  messageTts?: string;

  @ApiPropertyOptional({ description: '알림 채널', example: ['dashboard', 'push', 'sms'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channels?: string[];

  @ApiPropertyOptional({ description: '수신 대상 사용자 ID 목록' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  targetUserIds?: string[];

  @ApiPropertyOptional({ description: 'AI 예측 ID' })
  @IsOptional()
  @IsUUID('4')
  predictionId?: string;
}
