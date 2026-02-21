import { IsOptional, IsDateString, IsUUID, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStatisticsDto {
  @ApiPropertyOptional({ description: '시작일' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: '종료일' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ description: '그룹 기준 (month/type/farm/hour)' })
  @IsOptional()
  @IsString()
  groupBy?: string;

  @ApiPropertyOptional({ description: '농가 ID' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;
}
