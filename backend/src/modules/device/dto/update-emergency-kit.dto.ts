import { IsString, IsEnum, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { KitType, KitStatus } from '../../../database/entities/emergency-kit.entity';

export class UpdateEmergencyKitDto {
  @ApiPropertyOptional({ example: 'EK-2024-0001', description: '시리얼 번호' })
  @IsOptional()
  @IsString()
  serialNo?: string;

  @ApiPropertyOptional({ enum: KitType, description: '키트 타입' })
  @IsOptional()
  @IsEnum(KitType, { message: '유효하지 않은 키트 타입입니다.' })
  type?: KitType;

  @ApiPropertyOptional({ description: '소속 농가 ID' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ description: '작업장 ID' })
  @IsOptional()
  @IsUUID('4')
  workplaceId?: string;

  @ApiPropertyOptional({ description: '차량 식별자' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional({ example: 34.9403, description: '위도' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 126.7157, description: '경도' })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ enum: KitStatus, description: '상태' })
  @IsOptional()
  @IsEnum(KitStatus, { message: '유효하지 않은 상태입니다.' })
  status?: KitStatus;
}
