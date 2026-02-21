import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateThresholdDto {
  @ApiProperty({ example: 30, description: '주의 임계값' })
  @IsNumber()
  caution: number;

  @ApiProperty({ example: 35, description: '경고 임계값' })
  @IsNumber()
  warning: number;

  @ApiProperty({ example: 40, description: '위험 임계값' })
  @IsNumber()
  danger: number;
}
