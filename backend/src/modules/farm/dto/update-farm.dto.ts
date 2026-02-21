import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FarmType } from '../../../database/entities/farm.entity';

export class UpdateFarmDto {
  @ApiPropertyOptional({ example: '행복농장' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  ownerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ enum: FarmType })
  @IsOptional()
  @IsEnum(FarmType)
  farmType?: FarmType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
