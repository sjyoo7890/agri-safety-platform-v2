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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('교육 일정')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('education/schedules')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  @Post()
  @Roles('admin', 'edu_manager')
  @ApiOperation({ summary: '교육 일정 등록' })
  create(@Body() dto: CreateScheduleDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '교육 일정 목록 조회' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('admin', 'edu_manager', 'farm_manager')
  @ApiOperation({ summary: '교육 일정 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'edu_manager')
  @ApiOperation({ summary: '교육 일정 수정' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateScheduleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '교육 일정 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
