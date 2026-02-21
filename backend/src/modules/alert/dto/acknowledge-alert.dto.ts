import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcknowledgeAlertDto {
  @ApiProperty({ description: '수신확인 처리할 사용자 ID' })
  @IsUUID('4')
  userId: string;
}
