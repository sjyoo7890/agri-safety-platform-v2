import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkplaceType } from '../../../database/entities/workplace.entity';

export class CreateWorkplaceDto {
  @ApiProperty({ example: '1번 비닐하우스', description: '작업장명' })
  @IsString()
  name: string;

  @ApiProperty({ enum: WorkplaceType, example: WorkplaceType.GREENHOUSE, description: '작업장 유형' })
  @IsEnum(WorkplaceType, { message: '유효하지 않은 작업장 유형입니다.' })
  type: WorkplaceType;

  @ApiProperty({ example: 34.9403, description: '중심 위도' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 126.7157, description: '중심 경도' })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({ description: 'GeoJSON Polygon 형식의 작업장 영역' })
  @IsOptional()
  @IsObject()
  geofence?: object;
}
