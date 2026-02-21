import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인 (이메일 + 비밀번호 → JWT 발급)' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Refresh Token → HttpOnly Cookie
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Access Token 재발급 (Refresh Token 사용)' })
  @ApiResponse({ status: 200, description: '토큰 재발급 성공' })
  @ApiResponse({ status: 401, description: '유효하지 않은 Refresh Token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { refreshToken?: string },
  ) {
    // 쿠키 우선, body fallback
    const refreshToken =
      req.cookies?.refreshToken || body?.refreshToken;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: 'Refresh Token이 제공되지 않았습니다.',
      });
    }

    const result = await this.authService.refresh(refreshToken);

    // 새 Refresh Token → HttpOnly Cookie
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃 (Refresh Token 무효화)' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(
    @CurrentUser('id') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Authorization 헤더에서 access token 추출
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    await this.authService.logout(userId, accessToken);

    // Refresh Token 쿠키 삭제
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/api/v1/auth',
    });

    return { message: '로그아웃되었습니다.' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 로그인 사용자 정보' })
  @ApiResponse({ status: 200, description: '사용자 정보 반환' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }
}
