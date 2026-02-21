import { IsEnum, IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EduAccidentType,
  EduContentType,
  SimulatorType,
  EduDifficulty,
  EduContentStatus,
} from '../../../database/entities/edu-content.entity';

export class CreateEduContentDto {
  @ApiProperty({ description: '교육 콘텐츠 제목' })
  @IsString()
  title: string;

  @ApiProperty({ enum: EduAccidentType, description: '대상 사고유형' })
  @IsEnum(EduAccidentType)
  accidentType: EduAccidentType;

  @ApiProperty({ enum: EduContentType, description: '콘텐츠 유형' })
  @IsEnum(EduContentType)
  type: EduContentType;

  @ApiPropertyOptional({ enum: SimulatorType, description: '시뮬레이터 타입' })
  @IsOptional()
  @IsEnum(SimulatorType)
  simulatorType?: SimulatorType;

  @ApiPropertyOptional({ description: '버전' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ description: '시나리오 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '예상 소요 시간(분)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMin?: number;

  @ApiPropertyOptional({ enum: EduDifficulty, description: '난이도' })
  @IsOptional()
  @IsEnum(EduDifficulty)
  difficulty?: EduDifficulty;

  @ApiPropertyOptional({ enum: EduContentStatus, description: '배포 상태' })
  @IsOptional()
  @IsEnum(EduContentStatus)
  status?: EduContentStatus;
}
