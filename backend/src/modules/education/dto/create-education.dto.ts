import { IsUUID, IsOptional, IsBoolean, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({ description: '작업자 ID' })
  @IsUUID('4')
  workerId: string;

  @ApiProperty({ description: '교육 콘텐츠 ID' })
  @IsUUID('4')
  contentId: string;

  @ApiPropertyOptional({ description: '완료 여부' })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({ description: '점수 (0~100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({ description: '소요 시간(분)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMin?: number;

  @ApiPropertyOptional({ description: '이수 일시' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
