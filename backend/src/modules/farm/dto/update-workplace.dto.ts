import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkplaceType } from '../../../database/entities/workplace.entity';

export class UpdateWorkplaceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: WorkplaceType })
  @IsOptional()
  @IsEnum(WorkplaceType)
  type?: WorkplaceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  geofence?: object;
}
