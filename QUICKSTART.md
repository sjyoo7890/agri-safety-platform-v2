# Claude Code 퀵스타트 가이드

## 사전 준비

### 1. 프로젝트 디렉토리 생성
```bash
mkdir agri-safety-platform
cd agri-safety-platform
```

### 2. 파일 배치
이 폴더의 파일들을 프로젝트 루트에 복사합니다:
```
agri-safety-platform/
├── CLAUDE.md          ← 프로젝트 루트에 배치 (Claude Code가 자동 읽음)
├── docs/              ← 모듈별 PRD 문서
│   ├── prd-overview.md
│   ├── prd-dashboard.md
│   ├── prd-worker.md
│   ├── prd-ai.md
│   ├── prd-device.md
│   ├── prd-alert.md
│   ├── prd-report.md
│   ├── prd-education.md
│   ├── prd-system.md
│   ├── prd-mobile.md
│   ├── data-model.md
│   └── nonfunctional.md
└── QUICKSTART.md      ← 이 파일
```

### 3. Claude Code 실행
```bash
claude
```

---

## 단계별 명령어 가이드

### 🟢 STEP 1: 프로젝트 스캐폴딩 (최초 1회)

```
프로젝트 초기 구조를 잡아줘.

- monorepo 구조: /frontend (React 18 + TypeScript + Vite), /backend (NestJS), /ai-service (Python FastAPI)
- Docker Compose 설정: PostgreSQL 16, TimescaleDB, Redis 7, Mosquitto MQTT 브로커, Nginx
- frontend: Tailwind CSS, React Router, Zustand 상태관리, Axios 설치
- backend: TypeORM, @nestjs/passport, @nestjs/jwt, @nestjs/swagger, class-validator 설치
- 환경변수 파일 (.env.example) 생성
- CLAUDE.md 참고해서 기술 스택 맞춰줘
```

### 🟢 STEP 2: 데이터베이스 스키마

```
@docs/data-model.md 를 참고해서 백엔드 데이터베이스 스키마를 구현해줘.

- TypeORM 엔티티 14개: User, Farm, Workplace, Worker, SmartVest, EmergencyKit, Sensor, SensorData, Alert, Accident, RiskAssessment, AIPrediction, Education, EduContent
- PostgreSQL용 엔티티 생성 (UUID PK, 적절한 관계 설정)
- SensorData는 TimescaleDB 하이퍼테이블 마이그레이션 포함
- 초기 시드 데이터 (admin 유저, 샘플 농가 1개)
```

### 🟢 STEP 3: 인증/인가 모듈

```
@docs/prd-system.md 참고해서 인증/인가 모듈을 구현해줘.

백엔드:
- POST /api/v1/auth/login (이메일 + 비밀번호 → JWT access/refresh token)
- POST /api/v1/auth/refresh (토큰 재발급)
- POST /api/v1/auth/logout
- GET /api/v1/auth/me
- JwtAuthGuard, RolesGuard, @Roles() 데코레이터, @CurrentUser() 데코레이터
- Refresh Token은 Redis에 저장
- Swagger 문서화

프론트엔드:
- 로그인 페이지 (/login)
- 인증 상태 관리 (Zustand auth store)
- Axios 인터셉터로 토큰 자동 첨부 + 만료 시 자동 재발급
- ProtectedRoute 컴포넌트
```

### 🟢 STEP 4: 시스템 관리 기본 CRUD

```
@docs/prd-system.md 참고해서 시스템 관리 모듈을 구현해줘.

백엔드:
- CRUD /api/v1/users (사용자 관리)
- CRUD /api/v1/farms (농가 관리)  
- CRUD /api/v1/farms/{id}/workplaces (농작업장 관리)
- 역할별 접근 권한 적용 (admin은 전체, farm_manager는 소속만)
- Swagger 문서화

프론트엔드:
- 사이드바 네비게이션 레이아웃 (대시보드/디바이스/알림/분석/교육/시스템)
- 사용자 관리 페이지 (목록 테이블 + 등록/수정 모달)
- 농가 관리 페이지 (목록 + 등록 폼, Leaflet 지도에서 위치 선택)
```

### 🟡 STEP 5: 실시간 대시보드

```
@docs/prd-dashboard.md 참고해서 실시간 모니터링 대시보드를 구현해줘.

프론트엔드:
- 통합 관제 대시보드 페이지 (/dashboard)
- Leaflet GIS 지도: 농장/작업자/센서 위치 마커, 위험 등급별 색상
- 실시간 센서 상태 패널: 온도/습도/가스농도 게이지 (Recharts)
- 작업자 상태 카드 목록 (이름, 심박, 위험등급, 클릭 시 상세 페이지 이동)
- 최근 알림 타임라인 (최근 24시간)

백엔드:
- GET /api/v1/dashboard/overview
- GET /api/v1/dashboard/map
- WebSocket 게이트웨이 (/ws/dashboard) - sensor_update, worker_status 이벤트
```

### 🟡 STEP 6: IoT 디바이스 관리

```
@docs/prd-device.md 참고해서 IoT 디바이스 관리 모듈을 구현해줘.

- 스마트 조끼 관리: CRUD + 배정/회수, 배터리/통신 상태 표시
- 응급키트 관리: CRUD + 지도 위치 표시, 개폐 이벤트 로그
- 환경 센서 관리: CRUD + 데이터 트렌드 차트, 임계값 설정 폼
- 탭으로 3가지 디바이스 유형 전환
- 디바이스 목록은 테이블 + 페이지네이션 + 필터링
```

### 🟡 STEP 7: 알림 시스템

```
@docs/prd-alert.md 참고해서 알림 및 비상 대응 모듈을 구현해줘.

백엔드:
- 알림 CRUD + 이력 조회 (필터링/페이지네이션)
- 알림 규칙 설정 (위험 등급별 채널 매핑)
- E-Call API (POST /api/v1/ecall)
- 에스컬레이션: 알림 발송 후 타이머 → 미응답 시 다음 단계 트리거

프론트엔드:
- 알림 설정 화면 (등급별 채널 토글, 수신자 그룹, 에스컬레이션 규칙)
- 알림 이력 테이블 (등급별 색상 뱃지, 확인 여부)
```

### 🔵 STEP 8: 작업자 상세 모니터링

```
@docs/prd-worker.md 참고해서 작업자 상세 모니터링 페이지를 구현해줘.

- 대시보드 작업자 카드 클릭 → /workers/{id} 페이지
- 프로필 카드 (기본정보 + 위험등급 + 조끼 상태)
- 생체신호 차트 (심박, 체온 라인차트, 임계치 표시선)
- 자세/동작 상태 아이콘 (정상/위험자세/쓰러짐)
- 작업 이력 타임라인 (가로 바 차트)
- 열 순응도 분석 결과
```

### 🔵 STEP 9: AI 예측 및 위험성평가

```
@docs/prd-ai.md 참고해서 AI 사고 예측 관리 화면을 구현해줘.

프론트엔드:
- 6대 사고유형 레이더 차트 (Recharts RadarChart)
- XAI 기여요인 수평 바 차트
- LLM 자연어 알림 메시지 카드
- 모델 성능 테이블 (Accuracy, AUROC, 오경보율)
- 동적 위험성평가 현황 패널 (위험등급 게이지, 위험요인, 감소대책)

백엔드:
- GET /api/v1/predictions/realtime (목 데이터로 구현)
- GET /api/v1/predictions/{id}/xai
- GET /api/v1/risk-assessment/current
- AI 서비스와의 연동은 인터페이스만 정의 (FastAPI 스텁)
```

### 🔵 STEP 10: 사고 이력 및 리포트

```
@docs/prd-report.md 참고해서 사고 이력 및 분석 리포트 모듈을 구현해줘.

- 사고 이력 CRUD 페이지 (등록 폼 + 목록 테이블 + 상세 모달)
- 통계 대시보드 (기간별 추이, 사고유형별 파이차트, 시간대별 히트맵)
- 리포트 생성 버튼 (PDF 다운로드)
- CSV 다운로드 기능
```

### 🔵 STEP 11: 안전교육 관리

```
@docs/prd-education.md 참고해서 안전교육 관리 모듈을 구현해줘.

- 교육 콘텐츠 목록/등록 페이지
- 교육 이수 현황 매트릭스 (작업자 × 콘텐츠 완료 여부/점수)
- 미이수자 알림 발송 기능
- 시뮬레이터 상태 모니터링 카드
```

### 🔵 STEP 12: 작업자 모바일 웹

```
@docs/prd-mobile.md 참고해서 작업자용 모바일 웹을 구현해줘.

- 모바일 퍼스트 반응형 (320~428px 뷰포트)
- 큰 위험 상태 블록 (화면 40% 이상, 위험 등급별 색상)
- 생체신호 요약 (심박, 체온, 작업시간)
- E-Call 큰 빨간 버튼 (롱프레스 1.5초)
- 위험 알림 팝업 + TTS (Web Speech API)
- 큰 글씨 모드 (최소 18pt)
- PWA Service Worker 설정
```

---

## 팁

### `@` 참조 활용
Claude Code에서 `@파일명`으로 특정 문서를 컨텍스트에 포함:
```
@docs/prd-dashboard.md 이 문서의 FR-DASH-006 CCTV 연동 기능을 구현해줘
```

### 범위를 좁혀서 요청
```
# ❌ 너무 넓음
전체 프론트엔드를 만들어줘

# ✅ 적절한 범위  
대시보드 페이지의 GIS 지도 컴포넌트를 만들어줘. Leaflet 사용, 작업자 마커와 위험 등급별 색상 표시.
```

### 동작 확인 후 진행
```
# 각 단계에서
docker compose up -d
cd frontend && npm run dev
# 화면 확인 후 다음 단계로
```

### 에러 수정
```
이 에러를 수정해줘: [에러 메시지 붙여넣기]
관련 파일: @backend/src/modules/auth/auth.service.ts
```
