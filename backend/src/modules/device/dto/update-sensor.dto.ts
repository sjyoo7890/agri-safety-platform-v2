import { IsString, IsEnum, IsUUID, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SensorType } from '../../../database/entities/sensor.entity';

class ThresholdConfigDto {
  @ApiPropertyOptional({ example: 30, description: '주의 임계값' })
  @IsOptional()
  @IsNumber()
  caution?: number;

  @ApiPropertyOptional({ example: 35, description: '경고 임계값' })
  @IsOptional()
  @IsNumber()
  warning?: number;

  @ApiPropertyOptional({ example: 40, description: '위험 임계값' })
  @IsOptional()
  @IsNumber()
  danger?: number;
}

export class UpdateSensorDto {
  @ApiPropertyOptional({ example: 'ENV-2024-0001', description: '시리얼 번호' })
  @IsOptional()
  @IsString()
  serialNo?: string;

  @ApiPropertyOptional({ enum: SensorType, description: '센서 타입' })
  @IsOptional()
  @IsEnum(SensorType, { message: '유효하지 않은 센서 타입입니다.' })
  type?: SensorType;

  @ApiPropertyOptional({ description: '설치 작업장 ID' })
  @IsOptional()
  @IsUUID('4')
  workplaceId?: string;

  @ApiPropertyOptional({ example: 34.9403, description: '위도' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 126.7157, description: '경도' })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ description: '임계값 설정' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThresholdConfigDto)
  thresholdConfig?: ThresholdConfigDto;
}
