import { IsEnum, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType, AlertSeverity } from '../../../database/entities/alert.entity';

export class CreateAlertTemplateDto {
  @ApiProperty({ enum: AlertType, description: '사고유형' })
  @IsEnum(AlertType)
  alertType: AlertType;

  @ApiProperty({ enum: AlertSeverity, description: '위험등급' })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiProperty({ description: '템플릿 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '메시지 템플릿 (변수 치환 포맷)' })
  @IsString()
  messageTemplate: string;

  @ApiPropertyOptional({ description: 'TTS 메시지 템플릿' })
  @IsOptional()
  @IsString()
  ttsTemplate?: string;

  @ApiPropertyOptional({ description: '활성 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
