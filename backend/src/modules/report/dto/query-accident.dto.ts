import { IsOptional, IsEnum, IsDateString, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccidentType, AccidentSeverity } from '../../../database/entities/accident.entity';
import { Transform } from 'class-transformer';

export class QueryAccidentDto {
  @ApiPropertyOptional({ enum: AccidentType })
  @IsOptional()
  @IsEnum(AccidentType)
  type?: AccidentType;

  @ApiPropertyOptional({ enum: AccidentSeverity })
  @IsOptional()
  @IsEnum(AccidentSeverity)
  severity?: AccidentSeverity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ description: '아차사고만 조회' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isNearMiss?: boolean;
}
