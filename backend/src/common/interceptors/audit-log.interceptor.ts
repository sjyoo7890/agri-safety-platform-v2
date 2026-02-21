import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';

/** 민감 필드 마스킹 대상 */
const SENSITIVE_FIELDS = ['password', 'passwordHash', 'accessToken', 'refreshToken', 'token'];

function maskSensitiveData(data: unknown): object | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const masked = { ...data as Record<string, unknown> };
  for (const key of SENSITIVE_FIELDS) {
    if (key in masked) {
      masked[key] = '***MASKED***';
    }
  }
  return masked;
}

/** URL에서 리소스 이름과 ID 추출 */
function parseResource(url: string): { resource: string | undefined; resourceId: string | undefined } {
  // /api/v1/users/550e8400-... → resource: 'users', resourceId: '550e8400-...'
  const parts = url.replace(/^\/api\/v1\//, '').split('/').filter(Boolean);
  return {
    resource: parts[0] || undefined,
    resourceId: parts[1] || undefined,
  };
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, headers } = request;
    const now = Date.now();

    // GET 요청은 기록하지 않음 (읽기 전용 - 로그 양 최적화)
    if (method === 'GET') {
      return next.handle();
    }

    const user = request.user;
    const { resource, resourceId } = parseResource(url);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          this.saveLog({
            userId: user?.id || undefined,
            userEmail: user?.email || undefined,
            action: `${method} ${url}`,
            resource,
            resourceId,
            ip: ip || headers['x-forwarded-for'] || undefined,
            userAgent: headers['user-agent'] || undefined,
            statusCode: response.statusCode,
            requestBody: maskSensitiveData(body),
            durationMs: Date.now() - now,
          });
        },
        error: (error) => {
          this.saveLog({
            userId: user?.id || undefined,
            userEmail: user?.email || undefined,
            action: `${method} ${url}`,
            resource,
            resourceId,
            ip: ip || headers['x-forwarded-for'] || undefined,
            userAgent: headers['user-agent'] || undefined,
            statusCode: error.status || 500,
            requestBody: maskSensitiveData(body),
            durationMs: Date.now() - now,
          });
        },
      }),
    );
  }

  private saveLog(data: Partial<AuditLog>): void {
    // 비동기 저장 (요청 응답 지연 없이)
    this.auditLogRepository.save(this.auditLogRepository.create(data)).catch((err) => {
      console.error('감사 로그 저장 실패:', err.message);
    });
  }
}
