import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { ApiKey, ApiKeyStatus } from '../../database/entities/api-key.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  /** API 키 목록 조회 */
  async findAll(): Promise<ApiKey[]> {
    return this.apiKeyRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /** API 키 상세 조회 */
  async findOne(id: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
    if (!apiKey) {
      throw new NotFoundException('API 키를 찾을 수 없습니다.');
    }
    return apiKey;
  }

  /**
   * API 키 발급
   * 평문 키는 생성 시 1회만 반환, 이후 조회 불가
   */
  async create(
    dto: CreateApiKeyDto,
    createdBy: string,
  ): Promise<{ apiKey: ApiKey; plainKey: string }> {
    // 랜덤 키 생성: agri_sk_ + 32바이트 hex
    const rawKey = randomBytes(32).toString('hex');
    const plainKey = `agri_sk_${rawKey}`;

    // SHA256 해시 저장
    const keyHash = createHash('sha256').update(plainKey).digest('hex');
    const keyPrefix = `agri_sk_${rawKey.substring(0, 8)}`;

    const apiKey = this.apiKeyRepository.create({
      name: dto.name,
      keyHash,
      keyPrefix,
      description: dto.description,
      allowedIps: dto.allowedIps,
      rateLimit: dto.rateLimit ?? 1000,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      createdBy,
    });

    const saved = await this.apiKeyRepository.save(apiKey);
    return { apiKey: saved, plainKey };
  }

  /** API 키 폐기 */
  async revoke(id: string): Promise<ApiKey> {
    const apiKey = await this.findOne(id);
    apiKey.status = ApiKeyStatus.REVOKED;
    return this.apiKeyRepository.save(apiKey);
  }

  /** API 키 삭제 */
  async remove(id: string): Promise<void> {
    const apiKey = await this.findOne(id);
    await this.apiKeyRepository.remove(apiKey);
  }

  /** API 키 사용량 조회 */
  async getUsage(keyPrefix: string): Promise<{
    keyPrefix: string;
    totalRequests: number;
    rateLimit: number;
    lastUsedAt: Date | null;
    status: string;
  }> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { keyPrefix },
    });
    if (!apiKey) {
      throw new NotFoundException('API 키를 찾을 수 없습니다.');
    }

    return {
      keyPrefix: apiKey.keyPrefix,
      totalRequests: Number(apiKey.totalRequests),
      rateLimit: apiKey.rateLimit,
      lastUsedAt: apiKey.lastUsedAt,
      status: apiKey.status,
    };
  }

  /** 요청 시 사용 횟수 증가 (Open API Guard에서 호출) */
  async recordUsage(keyHash: string): Promise<void> {
    await this.apiKeyRepository
      .createQueryBuilder()
      .update(ApiKey)
      .set({
        totalRequests: () => '"total_requests" + 1',
        lastUsedAt: new Date(),
      })
      .where('keyHash = :keyHash', { keyHash })
      .execute();
  }
}
