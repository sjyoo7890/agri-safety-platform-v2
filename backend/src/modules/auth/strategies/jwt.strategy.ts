import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { RedisService } from '../../../database/redis.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  jti: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-jwt-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    // 블랙리스트 확인 (로그아웃된 토큰)
    if (payload.jti && await this.redisService.isBlacklisted(payload.jti)) {
      throw new UnauthorizedException('로그아웃된 토큰입니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      farmId: user.farmId,
    };
  }
}
