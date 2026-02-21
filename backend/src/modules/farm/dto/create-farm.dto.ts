import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FarmType } from '../../../database/entities/farm.entity';

export class CreateFarmDto {
  @ApiProperty({ example: '행복농장', description: '농가명' })
  @IsString()
  name: string;

  @ApiProperty({ description: '대표 관리자 ID' })
  @IsUUID('4')
  ownerId: string;

  @ApiProperty({ example: '전라남도 나주시 봉황면 농장길 123', description: '주소' })
  @IsString()
  address: string;

  @ApiProperty({ example: 34.9403, description: '위도' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 126.7157, description: '경도' })
  @IsNumber()
  lng: number;

  @ApiProperty({ enum: FarmType, example: FarmType.OPEN_FIELD, description: '작목 유형' })
  @IsEnum(FarmType, { message: '유효하지 않은 작목 유형입니다.' })
  farmType: FarmType;

  @ApiPropertyOptional({ example: 15000, description: '면적(㎡)' })
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({ example: '061-333-4444', description: '연락처' })
  @IsOptional()
  @IsString()
  phone?: string;
}
