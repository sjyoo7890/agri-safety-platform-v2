import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EduContentService } from './edu-content.service';
import { CreateEduContentDto } from './dto/create-edu-content.dto';
import { UpdateEduContentDto } from './dto/update-edu-content.dto';

@ApiTags('교육 콘텐츠')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('education/contents')
export class EduContentController {
  constructor(private readonly service: EduContentService) {}

  @Post()
  @Roles('admin', 'edu_manager')
  @ApiOperation({ summary: '교육 콘텐츠 등록' })
  create(@Body() dto: CreateEduContentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '교육 콘텐츠 목록 조회' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '교육 콘텐츠 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'edu_manager')
  @ApiOperation({ summary: '교육 콘텐츠 수정' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEduContentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '교육 콘텐츠 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
