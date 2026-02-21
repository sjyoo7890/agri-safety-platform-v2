import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 개발 토큰 → 사용자 매핑
const DEV_USERS: Record<string, { id: string; email: string; role: string; name: string; farmId: string | null }> = {
  'dev-token-admin': {
    id: '00000000-0000-4000-a000-000000000001',
    email: 'admin@example.com',
    role: 'admin',
    name: '관리자',
    farmId: null,
  },
  'dev-token-farm': {
    id: '00000000-0000-4000-a000-000000000002',
    email: 'farmer@example.com',
    role: 'farm_manager',
    name: '농장관리자',
    farmId: '00000000-0000-4000-a000-000000000010',
  },
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers?.authorization;
    if (auth) {
      const token = auth.replace('Bearer ', '');
      const devUser = DEV_USERS[token];
      if (devUser) {
        request.user = devUser;
        return true;
      }
    }
    return super.canActivate(context);
  }
}
