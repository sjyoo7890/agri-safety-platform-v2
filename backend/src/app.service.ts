import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'agri-safety-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
