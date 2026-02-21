import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiQuery({ name: 'farmId', required: false, description: '농장 ID 필터' })
  @ApiResponse({ status: 200, description: '사용자 목록' })
  findAll(@Query('farmId') farmId?: string) {
    return this.userService.findAll(farmId);
  }

  @Get(':id')
  @Roles('admin', 'farm_manager', 'govt_manager')
  @ApiOperation({ summary: '사용자 상세 조회' })
  @ApiResponse({ status: 200, description: '사용자 상세 정보' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '사용자 등록' })
  @ApiResponse({ status: 201, description: '사용자 등록 성공' })
  @ApiResponse({ status: 409, description: '이메일 중복' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @Roles('admin', 'farm_manager')
  @ApiOperation({ summary: '사용자 수정' })
  @ApiResponse({ status: 200, description: '사용자 수정 성공' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '사용자 삭제 (비활성화)' })
  @ApiResponse({ status: 200, description: '사용자 비활성화 성공' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
