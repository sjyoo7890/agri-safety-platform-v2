import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VestModuleType, CommType } from '../../../database/entities/smart-vest.entity';

export class CreateSmartVestDto {
  @ApiProperty({ example: 'SV-2024-0001', description: '시리얼 번호' })
  @IsString()
  serialNo: string;

  @ApiProperty({ enum: VestModuleType, example: VestModuleType.OPEN_FIELD, description: '모듈 타입' })
  @IsEnum(VestModuleType, { message: '유효하지 않은 모듈 타입입니다.' })
  moduleType: VestModuleType;

  @ApiProperty({ description: '소속 농가 ID' })
  @IsUUID('4')
  farmId: string;

  @ApiPropertyOptional({ enum: CommType, description: '통신 방식' })
  @IsOptional()
  @IsEnum(CommType, { message: '유효하지 않은 통신 방식입니다.' })
  commType?: CommType;

  @ApiPropertyOptional({ example: 'v1.2.0', description: '펌웨어 버전' })
  @IsOptional()
  @IsString()
  firmwareVer?: string;
}
