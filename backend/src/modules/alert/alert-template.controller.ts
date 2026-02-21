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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AlertTemplateService } from './alert-template.service';
import { CreateAlertTemplateDto } from './dto/create-alert-template.dto';
import { UpdateAlertTemplateDto } from './dto/update-alert-template.dto';

@ApiTags('알림 템플릿')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alerts/templates')
export class AlertTemplateController {
  constructor(private readonly templateService: AlertTemplateService) {}

  @Get()
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '알림 템플릿 목록 조회' })
  @ApiResponse({ status: 200, description: '템플릿 목록' })
  findAll() {
    return this.templateService.findAll();
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '알림 템플릿 생성' })
  @ApiResponse({ status: 201, description: '템플릿 생성 완료' })
  create(@Body() dto: CreateAlertTemplateDto) {
    return this.templateService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: '알림 템플릿 수정' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAlertTemplateDto,
  ) {
    return this.templateService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '알림 템플릿 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.templateService.remove(id);
  }
}
