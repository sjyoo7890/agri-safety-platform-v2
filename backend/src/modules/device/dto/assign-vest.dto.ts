import { IsUUID, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignVestDto {
  @ApiPropertyOptional({ description: '배정할 작업자 ID (null이면 회수)' })
  @IsOptional()
  @IsUUID('4')
  workerId?: string | null;
}
