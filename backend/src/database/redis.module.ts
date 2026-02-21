import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import redisConfig from '../config/redis.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const Redis = (await import('ioredis')).default;
        const password = configService.get<string>('redis.password');
        return new Redis({
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
          ...(password ? { password } : {}),
          tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
          maxRetriesPerRequest: 3,
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
