import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  @ApiOperation({ summary: 'API 키 목록 조회' })
  @ApiResponse({ status: 200, description: 'API 키 목록' })
  findAll() {
    return this.apiKeyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'API 키 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.apiKeyService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'API 키 발급 (평문 키는 1회만 반환)' })
  @ApiResponse({ status: 201, description: 'API 키 발급 성공' })
  create(
    @Body() dto: CreateApiKeyDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.apiKeyService.create(dto, userId);
  }

  @Put(':id/revoke')
  @ApiOperation({ summary: 'API 키 폐기' })
  @ApiResponse({ status: 200, description: 'API 키 폐기 성공' })
  revoke(@Param('id', ParseUUIDPipe) id: string) {
    return this.apiKeyService.revoke(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'API 키 삭제' })
  @ApiResponse({ status: 200, description: 'API 키 삭제 성공' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.apiKeyService.remove(id);
  }

  @Get(':keyPrefix/usage')
  @ApiOperation({ summary: 'API 키 사용량 조회' })
  @ApiResponse({ status: 200, description: 'API 키 사용량' })
  getUsage(@Param('keyPrefix') keyPrefix: string) {
    return this.apiKeyService.getUsage(keyPrefix);
  }
}
