import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProgressDto {
  @ApiPropertyOptional({ description: '농가 ID 필터' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ description: '작업자 ID 필터' })
  @IsOptional()
  @IsUUID('4')
  workerId?: string;
}
