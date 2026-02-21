import { IsString, IsEnum, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KitType } from '../../../database/entities/emergency-kit.entity';

export class CreateEmergencyKitDto {
  @ApiProperty({ example: 'EK-2024-0001', description: '시리얼 번호' })
  @IsString()
  serialNo: string;

  @ApiProperty({ enum: KitType, example: KitType.WALL_MOUNTED, description: '키트 타입' })
  @IsEnum(KitType, { message: '유효하지 않은 키트 타입입니다.' })
  type: KitType;

  @ApiProperty({ description: '소속 농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiPropertyOptional({ description: '작업장 ID' })
  @IsOptional()
  @IsUUID('4')
  workplaceId?: string;

  @ApiPropertyOptional({ description: '차량 식별자 (차량탑재형)' })
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
}
