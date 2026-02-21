import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../database/entities/user.entity';
import { RedisService } from '../../database/redis.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;
  private readonly refreshTtlSeconds: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'dev-refresh-secret',
    );
    this.refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
    // 7d → 초 단위 변환
    this.refreshTtlSeconds = 7 * 24 * 60 * 60;
  }

  /** 로그인: 이메일/비밀번호 검증 → Access + Refresh 토큰 발급 */
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    return this.generateTokens(user);
  }

  /** Refresh Token으로 새 Access Token 발급 */
  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string; role: string };

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    // Redis에 저장된 refresh token과 비교
    const storedToken = await this.redisService.getRefreshToken(payload.sub);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('만료되었거나 무효화된 Refresh Token입니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }

    return this.generateTokens(user);
  }

  /** 로그아웃: Refresh Token 삭제 + Access Token 블랙리스트 */
  async logout(userId: string, accessToken?: string): Promise<void> {
    // Refresh Token 삭제
    await this.redisService.deleteRefreshToken(userId);

    // Access Token 블랙리스트 등록 (남은 TTL만큼)
    if (accessToken) {
      try {
        const decoded = this.jwtService.decode(accessToken) as {
          jti: string;
          exp: number;
        };
        if (decoded?.jti && decoded?.exp) {
          const ttl = decoded.exp - Math.floor(Date.now() / 1000);
          if (ttl > 0) {
            await this.redisService.blacklistAccessToken(decoded.jti, ttl);
          }
        }
      } catch {
        // 디코딩 실패 무시 - 이미 만료된 토큰일 수 있음
      }
    }
  }

  /** 현재 사용자 정보 조회 */
  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['farm'],
    });

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      farmId: user.farmId,
      farm: user.farm
        ? { id: user.farm.id, name: user.farm.name }
        : null,
      createdAt: user.createdAt,
    };
  }

  /** Access + Refresh 토큰 쌍 생성 */
  private async generateTokens(user: User) {
    const jti = uuidv4();

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      },
    );

    // Redis에 Refresh Token 저장
    await this.redisService.setRefreshToken(
      user.id,
      refreshToken,
      this.refreshTtlSeconds,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
