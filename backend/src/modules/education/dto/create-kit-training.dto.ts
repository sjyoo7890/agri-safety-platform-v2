import { IsUUID, IsOptional, IsEnum, IsDateString, IsInt, Min, Max, IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KitTrainingType } from '../../../database/entities/kit-training.entity';

export class CreateKitTrainingDto {
  @ApiProperty({ description: '작업자 ID' })
  @IsUUID('4')
  workerId: string;

  @ApiPropertyOptional({ description: '농가 ID' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiProperty({ enum: KitTrainingType, description: '거치형/탑재형' })
  @IsEnum(KitTrainingType)
  trainingType: KitTrainingType;

  @ApiProperty({ description: '실습 일시' })
  @IsDateString()
  trainingDate: string;

  @ApiPropertyOptional({ description: '평가 점수 (0~100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({ description: '합격 여부' })
  @IsOptional()
  @IsBoolean()
  passed?: boolean;

  @ApiPropertyOptional({ description: '실습 소요 시간(분)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMin?: number;

  @ApiPropertyOptional({ description: '평가 코멘트' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '평가자명' })
  @IsOptional()
  @IsString()
  evaluatorName?: string;
}
