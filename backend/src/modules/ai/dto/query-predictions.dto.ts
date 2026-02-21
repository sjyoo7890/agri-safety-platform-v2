import { IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPredictionsDto {
  @ApiPropertyOptional({ description: '농가 ID' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ description: '작업자 ID' })
  @IsOptional()
  @IsUUID('4')
  workerId?: string;
}

export class QueryRiskHistoryDto {
  @ApiPropertyOptional({ description: '시작일시' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: '종료일시' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ description: '농가 ID' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ description: '작업장 ID' })
  @IsOptional()
  @IsUUID('4')
  workplaceId?: string;
}
