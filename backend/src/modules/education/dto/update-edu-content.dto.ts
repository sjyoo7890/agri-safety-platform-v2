import { PartialType } from '@nestjs/swagger';
import { CreateEduContentDto } from './create-edu-content.dto';

export class UpdateEduContentDto extends PartialType(CreateEduContentDto) {}
