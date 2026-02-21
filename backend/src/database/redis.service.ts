import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  /** Refresh Token 저장 (userId → token, TTL초) */
  async setRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(`refresh:${userId}`, token, 'EX', ttlSeconds);
  }

  /** Refresh Token 조회 */
  async getRefreshToken(userId: string): Promise<string | null> {
    return this.redis.get(`refresh:${userId}`);
  }

  /** Refresh Token 삭제 (로그아웃) */
  async deleteRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
  }

  /** Access Token 블랙리스트 등록 (로그아웃 시 남은 TTL만큼) */
  async blacklistAccessToken(jti: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(`blacklist:${jti}`, '1', 'EX', ttlSeconds);
  }

  /** Access Token 블랙리스트 확인 */
  async isBlacklisted(jti: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${jti}`);
    return result !== null;
  }

  /** 범용 set */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  /** 범용 get */
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  /** 범용 del */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
