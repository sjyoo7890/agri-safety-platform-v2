import { IsEnum, IsUUID, IsArray, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertSeverity } from '../../../database/entities/alert.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class AlertRuleItemDto {
  @ApiPropertyOptional({ description: '기존 규칙 ID (수정 시)' })
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ApiProperty({ enum: AlertSeverity, description: '위험등급' })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiProperty({ description: '알림 채널 목록', example: ['dashboard', 'push', 'sms'] })
  @IsArray()
  @IsString({ each: true })
  channels: string[];

  @ApiPropertyOptional({ description: '활성 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertAlertRuleDto {
  @ApiProperty({ description: '농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiProperty({ type: [AlertRuleItemDto], description: '알림 규칙 배열' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertRuleItemDto)
  rules: AlertRuleItemDto[];
}
