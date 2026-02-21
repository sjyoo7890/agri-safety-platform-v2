import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AccidentService } from './accident.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { QueryAccidentDto } from './dto/query-accident.dto';

@ApiTags('사고 이력')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accidents')
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @Post()
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '사고/아차사고 등록' })
  @ApiResponse({ status: 201, description: '사고 등록 완료' })
  create(@Body() dto: CreateAccidentDto) {
    return this.accidentService.create(dto);
  }

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '사고 이력 조회 (필터링)' })
  @ApiResponse({ status: 200, description: '사고 이력 목록' })
  findAll(@Query() query: QueryAccidentDto) {
    return this.accidentService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '사고 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accidentService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '사고 이력 수정' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccidentDto,
  ) {
    return this.accidentService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '사고 이력 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.accidentService.remove(id);
  }
}
