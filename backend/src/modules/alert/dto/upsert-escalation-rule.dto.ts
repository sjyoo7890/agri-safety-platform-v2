import { IsEnum, IsUUID, IsArray, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertSeverity } from '../../../database/entities/alert.entity';
import { EscalationTargetType } from '../../../database/entities/escalation-rule.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class EscalationRuleItemDto {
  @ApiPropertyOptional({ description: '기존 규칙 ID (수정 시)' })
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ApiProperty({ enum: AlertSeverity, description: '위험등급' })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiProperty({ description: '에스컬레이션 단계 (1부터)' })
  @IsInt()
  step: number;

  @ApiProperty({ description: '미응답 대기 시간(분)' })
  @IsInt()
  waitMinutes: number;

  @ApiProperty({ enum: EscalationTargetType, description: '에스컬레이션 대상' })
  @IsEnum(EscalationTargetType)
  targetType: EscalationTargetType;

  @ApiPropertyOptional({ description: '대상 사용자 ID 목록' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  targetUserIds?: string[];

  @ApiPropertyOptional({ description: '활성 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertEscalationRuleDto {
  @ApiProperty({ description: '농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiProperty({ type: [EscalationRuleItemDto], description: '에스컬레이션 규칙 배열' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EscalationRuleItemDto)
  rules: EscalationRuleItemDto[];
}
