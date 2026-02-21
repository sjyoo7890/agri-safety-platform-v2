# 지능형 농작업 안전관리 플랫폼

## 프로젝트 개요
고위험 농작업 현장의 6대 사고유형(추락/넘어짐, 끼임/감김, 온열질환/질식, 전기화재, 차량 전도/전복, 농기계-작업자 충돌)을 예방하기 위한 AI 기반 통합 안전관리 웹 플랫폼.

IoT 센서(스마트 안전조끼, 환경센서, CCTV), AI 예측 모델, 스마트 비상키트, 4D 안전교육 시뮬레이터를 통합 관리하는 중앙 허브 시스템이다.

## 기술 스택
- **Frontend**: React 18 + TypeScript, Tailwind CSS, Recharts (차트), Leaflet (GIS 지도)
- **Backend**: Node.js + NestJS (MSA 구조)
- **Database**: PostgreSQL + TimescaleDB (시계열), Redis (캐시/세션)
- **실시간 통신**: MQTT (센서 데이터 수집), WebSocket (대시보드 실시간), REST API (CRUD)
- **AI 서비스**: Python FastAPI 마이크로서비스 (예측 모델 서빙, ONNX Runtime)
- **인프라**: Docker, Docker Compose, Nginx (리버스 프록시)
- **인증**: OAuth 2.0 + JWT (access/refresh token), RBAC

## 프로젝트 구조
```
/
├── frontend/                # React 18 + TypeScript
│   ├── src/
│   │   ├── components/      # 공통 UI 컴포넌트
│   │   ├── pages/           # 라우팅 페이지
│   │   ├── features/        # 기능별 모듈 (dashboard, worker, ai, device, alert, report, education, system, mobile)
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 호출 서비스
│   │   ├── stores/          # 상태 관리 (Zustand)
│   │   ├── types/           # TypeScript 타입 정의
│   │   └── utils/           # 유틸리티 함수
│   └── public/
├── backend/                 # NestJS
│   ├── src/
│   │   ├── modules/         # 기능별 NestJS 모듈 (auth, user, farm, worker, device, sensor, alert, accident, risk, prediction, education)
│   │   ├── common/          # 공통 가드, 필터, 인터셉터, 데코레이터
│   │   ├── database/        # TypeORM 엔티티, 마이그레이션
│   │   └── config/          # 설정 파일
│   └── test/
├── ai-service/              # Python FastAPI
│   ├── app/
│   │   ├── models/          # AI 모델 로딩 및 추론
│   │   ├── routers/         # API 라우터
│   │   └── schemas/         # Pydantic 스키마
│   └── tests/
├── docker-compose.yml       # PostgreSQL, Redis, Mosquitto, Nginx
├── docs/                    # PRD 모듈별 문서 (이 폴더)
└── CLAUDE.md                # 이 파일
```

## 핵심 모듈 (개발 우선순위)
1. **FR-SYS** - 인증/사용자/농가/장비 관리
2. **FR-DASH** - 실시간 안전 모니터링 대시보드
3. **FR-DEV** - IoT 디바이스 관리 (스마트 조끼, 응급키트, 환경센서)
4. **FR-ALT** - 알림 및 비상 대응 (E-Call)
5. **FR-AI** - AI 사고 예측/판별 관리
6. **FR-WKR** - 작업자 상세 모니터링
7. **FR-DRA** - 동적 위험성평가 (DRA)
8. **FR-RPT** - 사고 이력 및 분석 리포트
9. **FR-EDU** - 안전교육 관리
10. **FR-MOB** - 작업자용 모바일 웹

## 사용자 역할 (RBAC)
| 역할 | 코드 | 권한 범위 |
|------|------|-----------|
| 시스템 관리자 | `admin` | 전체 시스템 운영, 사용자/설정 관리 |
| 농장 관리자 | `farm_manager` | 소속 농장 관제, 작업자 관리, 리포트 |
| 지자체/기관 관리자 | `govt_manager` | 관할 지역 통계/관제 (읽기 위주) |
| 안전교육 관리자 | `edu_manager` | 교육 콘텐츠/이수 현황 관리 |
| 현장 작업자 | `worker` | 모바일 웹 (알림 수신, E-Call, 건강 데이터 조회) |

## 데이터 흐름
```
IoT 센서 → MQTT Broker → 백엔드 수집 서비스 → TimescaleDB (시계열 저장)
                                              → AI 서비스 (실시간 예측)
                                              → WebSocket → 프론트엔드 대시보드
위험 감지 → 알림 서비스 → SMS / 앱 푸시 / 스마트조끼 진동 / E-Call
```

## 코딩 컨벤션
- **주석**: 한글 (복잡한 비즈니스 로직 설명)
- **코드**: 영문 (변수명, 함수명, 클래스명)
- **API 경로**: `/api/v1/...` (내부), `/open-api/v1/...` (외부 연동)
- **컴포넌트**: PascalCase (`DashboardMap.tsx`)
- **유틸/훅**: camelCase (`useWebSocket.ts`, `formatDate.ts`)
- **엔티티/DTO**: PascalCase (`Worker.entity.ts`, `CreateWorkerDto.ts`)
- **API 문서화**: Swagger (NestJS `@nestjs/swagger` 데코레이터)
- **테스트**: Jest (백엔드 단위테스트), Vitest (프론트엔드)
- **커밋 메시지**: Conventional Commits (`feat:`, `fix:`, `docs:`)

## 위험 등급 체계
| 등급 | 코드 | 색상 | 조건 |
|------|------|------|------|
| 정상 | `normal` | 녹색 (#22C55E) | 위험도 0~25 |
| 주의 | `caution` | 노랑 (#EAB308) | 위험도 26~50 |
| 경고 | `warning` | 주황 (#F97316) | 위험도 51~75 |
| 위험 | `danger` | 빨강 (#EF4444) | 위험도 76~100 |

## 6대 사고유형 코드
| 코드 | 사고유형 | AI 모델 입력 |
|------|----------|-------------|
| `FALL` | 추락/넘어짐 | IMU 합성 가속도, 자세 변화각 |
| `ENTANGLE` | 끼임/감김 | 영상 인식, 근접 센서 |
| `HEAT` | 온열질환/질식 | 체온, 심박, WBGT, 가스농도 |
| `FIRE` | 전기화재 | 전류/전압, 온도, 아크 센서 |
| `ROLLOVER` | 차량 전도/전복 | IMU Roll/Pitch, 속도, 조향각 |
| `COLLISION` | 농기계-작업자 충돌 | UWB 거리, LiDAR, 카메라 |

## PRD 문서 참조
상세 요구사항은 `docs/` 폴더의 모듈별 PRD 문서를 참고:
- `docs/prd-overview.md` - 프로젝트 개요, 아키텍처, 데이터 흐름
- `docs/prd-dashboard.md` - 실시간 대시보드 (FR-DASH)
- `docs/prd-worker.md` - 작업자 상세 모니터링 (FR-WKR)
- `docs/prd-ai.md` - AI 예측/판별 + 동적 위험성평가 (FR-AI, FR-DRA)
- `docs/prd-device.md` - IoT 디바이스 관리 (FR-DEV, FR-KIT, FR-ENV)
- `docs/prd-alert.md` - 알림 및 비상 대응 (FR-ALT)
- `docs/prd-report.md` - 사고 이력 및 분석 리포트 (FR-RPT)
- `docs/prd-education.md` - 안전교육 관리 (FR-EDU)
- `docs/prd-system.md` - 시스템 관리 및 인증 (FR-SYS)
- `docs/prd-mobile.md` - 작업자용 모바일 웹 (FR-MOB)
- `docs/data-model.md` - 데이터 모델 + API 설계
- `docs/nonfunctional.md` - 비기능 요구사항 (성능/보안/가용성/UX)
