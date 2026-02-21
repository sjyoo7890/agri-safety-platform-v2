import { IsString, IsOptional, IsUUID, IsInt, IsArray, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleStatus } from '../../../database/entities/edu-schedule.entity';

export class CreateScheduleDto {
  @ApiProperty({ description: '교육 제목' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '농가 ID' })
  @IsOptional()
  @IsUUID('4')
  farmId?: string;

  @ApiPropertyOptional({ description: '교육 콘텐츠 ID 목록', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  contentIds?: string[];

  @ApiPropertyOptional({ description: '교육 강사명' })
  @IsOptional()
  @IsString()
  instructorName?: string;

  @ApiProperty({ description: '교육 예정일 (YYYY-MM-DD)' })
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional({ description: '시작 시간 (HH:mm)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: '종료 시간 (HH:mm)' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: '교육 장소' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: '최대 참가 인원' })
  @IsOptional()
  @IsInt()
  maxParticipants?: number;

  @ApiPropertyOptional({ description: '참가 작업자 ID 목록', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participantIds?: string[];

  @ApiPropertyOptional({ enum: ScheduleStatus })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @ApiPropertyOptional({ description: '비고' })
  @IsOptional()
  @IsString()
  notes?: string;
}
