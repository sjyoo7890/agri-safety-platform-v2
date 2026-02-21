import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryVitalsDto {
  @ApiPropertyOptional({ description: '시작일시 (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: '종료일시 (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
