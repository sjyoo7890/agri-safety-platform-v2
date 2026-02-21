import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ECallService } from './ecall.service';
import { CreateECallDto } from './dto/create-ecall.dto';

@ApiTags('E-Call 긴급호출')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ecall')
export class ECallController {
  constructor(private readonly ecallService: ECallService) {}

  @Post()
  @Roles('admin', 'farm_manager', 'worker')
  @ApiOperation({ summary: 'E-Call 긴급 호출' })
  @ApiResponse({ status: 201, description: 'E-Call 발동 완료' })
  create(@Body() dto: CreateECallDto) {
    return this.ecallService.create(dto);
  }

  @Get('history')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: 'E-Call 이력 조회' })
  @ApiQuery({ name: 'farmId', required: false })
  @ApiResponse({ status: 200, description: 'E-Call 이력 목록' })
  findHistory(@Query('farmId') farmId?: string) {
    return this.ecallService.findHistory(farmId);
  }

  @Put(':id/resolve')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: 'E-Call 종료 처리' })
  @ApiResponse({ status: 200, description: 'E-Call 종료 완료' })
  resolve(@Param('id', ParseUUIDPipe) id: string) {
    return this.ecallService.resolve(id);
  }
}
