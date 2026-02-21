# 데이터 모델 및 API 설계

## 1. 핵심 엔티티 (14개)

### User (사용자)
```
User {
  id            UUID        PK
  email         string      UNIQUE, NOT NULL
  password_hash string      NOT NULL
  name          string      NOT NULL
  phone         string
  role          enum        'admin' | 'farm_manager' | 'govt_manager' | 'edu_manager' | 'worker'
  farm_id       UUID        FK(Farm), nullable (admin/govt_manager는 null)
  is_active     boolean     default true
  created_at    timestamp
  updated_at    timestamp
}
```

### Farm (농가)
```
Farm {
  id            UUID        PK
  name          string      NOT NULL
  owner_id      UUID        FK(User)
  address       string      NOT NULL
  lat           float       NOT NULL
  lng           float       NOT NULL
  farm_type     enum        'open_field' | 'livestock' | 'orchard' | 'greenhouse'
  area          float       면적(㎡)
  phone         string
  created_at    timestamp
  updated_at    timestamp
}
```

### Workplace (농작업장)
```
Workplace {
  id            UUID        PK
  farm_id       UUID        FK(Farm), NOT NULL
  name          string      NOT NULL (예: "1번 비닐하우스")
  type          enum        'open_field' | 'greenhouse' | 'barn' | 'orchard' | 'warehouse'
  lat           float       NOT NULL
  lng           float       NOT NULL
  geofence      json        GeoJSON polygon (작업장 영역)
  created_at    timestamp
}
```

### Worker (작업자)
```
Worker {
  id                    UUID        PK
  user_id               UUID        FK(User), UNIQUE
  farm_id               UUID        FK(Farm), NOT NULL
  age                   int
  gender                enum        'M' | 'F'
  bmi                   float
  acclimatization_level enum        'A' | 'B' | 'C'  (완전순응/부분순응/미순응)
  emergency_contact     string      보호자 연락처
  created_at            timestamp
  updated_at            timestamp
}
```

### SmartVest (스마트 조끼)
```
SmartVest {
  id              UUID        PK
  serial_no       string      UNIQUE, NOT NULL
  module_type     enum        'open_field' | 'livestock' | 'orchard'
  worker_id       UUID        FK(Worker), nullable (미배정 가능)
  farm_id         UUID        FK(Farm), NOT NULL
  battery_level   int         0~100
  comm_status     enum        'online' | 'offline' | 'error'
  comm_type       enum        'ble' | 'lora' | 'lte'
  last_heartbeat  timestamp
  firmware_ver    string
  created_at      timestamp
  updated_at      timestamp
}
```

### EmergencyKit (응급키트)
```
EmergencyKit {
  id              UUID        PK
  serial_no       string      UNIQUE
  type            enum        'wall_mounted' | 'vehicle_mounted'
  farm_id         UUID        FK(Farm), NOT NULL
  workplace_id    UUID        FK(Workplace), nullable
  vehicle_id      string      차량탑재형인 경우 농기계 식별자
  lat             float
  lng             float
  status          enum        'normal' | 'opened' | 'alarm' | 'maintenance'
  battery_level   int
  last_heartbeat  timestamp
  created_at      timestamp
}
```

### Sensor (환경센서)
```
Sensor {
  id              UUID        PK
  serial_no       string      UNIQUE
  type            enum        'temperature' | 'humidity' | 'gas_o2' | 'gas_h2s' | 'gas_nh3' | 'gas_ch4' | 'current' | 'voltage' | 'wbgt'
  workplace_id    UUID        FK(Workplace), NOT NULL
  lat             float
  lng             float
  status          enum        'online' | 'offline' | 'error' | 'calibrating'
  threshold_config json       { caution: number, warning: number, danger: number }
  last_heartbeat  timestamp
  created_at      timestamp
}
```

### SensorData (센서 데이터) - TimescaleDB 하이퍼테이블
```
SensorData {
  time            timestamp   NOT NULL (파티셔닝 키)
  sensor_id       UUID        FK(Sensor), NOT NULL
  value           float       NOT NULL
  unit            string      (℃, %, ppm, A, V 등)
  metadata        json        추가 메타데이터
}
-- TimescaleDB: SELECT create_hypertable('sensor_data', 'time');
-- 보존 정책: 원본 90일, 1시간 집계 1년, 일별 집계 영구
```

### Alert (알림)
```
Alert {
  id              UUID        PK
  type            enum        'FALL' | 'ENTANGLE' | 'HEAT' | 'FIRE' | 'ROLLOVER' | 'COLLISION' | 'DEVICE' | 'SYSTEM'
  severity        enum        'info' | 'caution' | 'warning' | 'danger'
  farm_id         UUID        FK(Farm)
  workplace_id    UUID        FK(Workplace), nullable
  worker_id       UUID        FK(Worker), nullable
  message         text        NOT NULL
  message_tts     text        TTS용 메시지
  channels        json        ['dashboard', 'push', 'sms', 'vest', 'beacon']
  target_user_ids UUID[]      수신 대상 사용자 ID 목록
  status          enum        'sent' | 'acknowledged' | 'escalated' | 'resolved'
  acknowledged_at timestamp   확인 시각
  acknowledged_by UUID        FK(User)
  prediction_id   UUID        FK(AIPrediction), nullable
  created_at      timestamp
}
```

### Accident (사고 이력)
```
Accident {
  id              UUID        PK
  type            enum        'FALL' | 'ENTANGLE' | 'HEAT' | 'FIRE' | 'ROLLOVER' | 'COLLISION' | 'OTHER'
  severity        enum        'minor' | 'moderate' | 'severe' | 'fatal'
  is_near_miss    boolean     아차사고 여부
  farm_id         UUID        FK(Farm), NOT NULL
  workplace_id    UUID        FK(Workplace)
  worker_id       UUID        FK(Worker), nullable
  occurred_at     timestamp   NOT NULL
  description     text        사고 경위
  cause           text        원인 분석
  actions_taken   text        조치사항
  attachments     json        첨부파일 URL 목록
  created_by      UUID        FK(User)
  created_at      timestamp
  updated_at      timestamp
}
```

### RiskAssessment (위험성평가)
```
RiskAssessment {
  id              UUID        PK
  farm_id         UUID        FK(Farm), NOT NULL
  workplace_id    UUID        FK(Workplace)
  risk_score      int         0~100
  risk_level      enum        'normal' | 'caution' | 'warning' | 'danger'
  hazards         json        위험요인 목록 [{ code, name, score, source }]
  countermeasures json        감소대책 목록 [{ code, action, priority }]
  assessed_at     timestamp   NOT NULL
  expires_at      timestamp   평가 유효기간
}
```

### AIPrediction (AI 예측 결과)
```
AIPrediction {
  id              UUID        PK
  model_type      enum        'FALL' | 'ENTANGLE' | 'HEAT' | 'FIRE' | 'ROLLOVER' | 'COLLISION'
  farm_id         UUID        FK(Farm)
  worker_id       UUID        FK(Worker), nullable
  input_summary   json        입력 데이터 요약
  prediction      float       위험도 점수 0~100
  confidence      float       신뢰도 0~1
  xai_result      json        SHAP/LIME 분석 결과 [{ feature, contribution }]
  llm_message     text        LLM 자연어 변환 메시지
  is_false_alarm  boolean     오경보 여부 (사후 마킹)
  created_at      timestamp
}
```

### Education (교육 이력)
```
Education {
  id              UUID        PK
  worker_id       UUID        FK(Worker), NOT NULL
  content_id      UUID        FK(EduContent), NOT NULL
  completed       boolean     default false
  score           int         0~100
  duration_min    int         교육 소요 시간(분)
  weakness_analysis json      AI 분석 취약점 [{ type, description }]
  completed_at    timestamp
  created_at      timestamp
}
```

### EduContent (교육 콘텐츠)
```
EduContent {
  id              UUID        PK
  title           string      NOT NULL
  accident_type   enum        'FALL' | 'ENTANGLE' | 'HEAT' | 'FIRE' | 'ROLLOVER' | 'COLLISION'
  type            enum        'vr_content' | 'kit_training' | 'classroom'
  simulator_type  enum        'six_axis' | 'treadmill' | null
  version         string      (예: "2.1.0")
  description     text
  duration_min    int         예상 소요 시간(분)
  difficulty      enum        'beginner' | 'intermediate' | 'advanced'
  status          enum        'draft' | 'published' | 'archived'
  created_at      timestamp
  updated_at      timestamp
}
```

## 2. ER 관계 요약

```
User 1--1 Worker (작업자인 경우)
User 1--N Farm (관리자는 여러 농가 가능, owner_id 기준)
Farm 1--N Workplace
Farm 1--N Worker
Farm 1--N SmartVest
Farm 1--N EmergencyKit
Workplace 1--N Sensor
Sensor 1--N SensorData
Worker 1--1 SmartVest (배정 시)
Worker 1--N Education
Worker 1--N Alert (수신)
Worker 1--N Accident (관련)
Worker 1--N AIPrediction
Farm 1--N Alert
Farm 1--N Accident
Farm 1--N RiskAssessment
EduContent 1--N Education
```

## 3. 내부 API 설계 (RESTful)

### 공통 규칙
- Base URL: `/api/v1`
- 인증: `Authorization: Bearer <access_token>`
- 페이지네이션: `?page=1&limit=20`
- 정렬: `?sort=created_at&order=desc`
- 응답 형식: `{ data: T, meta: { page, limit, total } }`
- 에러 형식: `{ statusCode, message, error }`

### API 목록

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/auth/login` | 로그인 |
| POST | `/api/v1/auth/refresh` | 토큰 재발급 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| GET | `/api/v1/auth/me` | 현재 사용자 |
| CRUD | `/api/v1/users` | 사용자 관리 |
| CRUD | `/api/v1/farms` | 농가 관리 |
| CRUD | `/api/v1/farms/{id}/workplaces` | 농작업장 관리 |
| CRUD | `/api/v1/workers` | 작업자 관리 |
| GET | `/api/v1/workers/{id}/status` | 작업자 실시간 상태 |
| GET | `/api/v1/workers/{id}/timeline` | 작업자 활동 타임라인 |
| GET | `/api/v1/workers/{id}/vitals` | 생체신호 이력 |
| GET | `/api/v1/workers/{id}/acclimatization` | 열 순응도 |
| GET | `/api/v1/dashboard/overview` | 대시보드 요약 |
| GET | `/api/v1/dashboard/map` | GIS 지도 데이터 |
| CRUD | `/api/v1/devices/vests` | 스마트 조끼 |
| POST | `/api/v1/devices/vests/{id}/assign` | 조끼 배정 |
| CRUD | `/api/v1/devices/kits` | 응급키트 |
| GET | `/api/v1/devices/kits/{id}/events` | 키트 이벤트 로그 |
| CRUD | `/api/v1/devices/sensors` | 환경센서 |
| GET | `/api/v1/devices/sensors/{id}/data` | 센서 데이터 조회 |
| PUT | `/api/v1/devices/sensors/{id}/threshold` | 임계값 설정 |
| GET | `/api/v1/predictions/realtime` | 실시간 예측 결과 |
| GET | `/api/v1/predictions/{id}/xai` | XAI 분석 |
| POST | `/api/v1/predictions/{id}/false-alarm` | 오경보 마킹 |
| GET | `/api/v1/risk-assessment/current` | 현재 위험성평가 |
| GET | `/api/v1/risk-assessment/history` | 평가 이력 |
| POST | `/api/v1/alerts` | 알림 생성 |
| GET | `/api/v1/alerts/history` | 알림 이력 |
| PUT | `/api/v1/alerts/{id}/acknowledge` | 알림 확인 |
| GET/PUT | `/api/v1/alerts/rules` | 알림 규칙 |
| POST | `/api/v1/ecall` | E-Call 발동 |
| CRUD | `/api/v1/accidents` | 사고 이력 |
| GET | `/api/v1/reports/statistics` | 통계 데이터 |
| POST | `/api/v1/reports/generate` | 리포트 생성 |
| CRUD | `/api/v1/education/contents` | 교육 콘텐츠 |
| GET | `/api/v1/education/progress/{worker_id}` | 교육 이수 현황 |
| GET | `/api/v1/audit-logs` | 감사 로그 |
| GET/PUT | `/api/v1/settings` | 시스템 설정 |
| CRUD | `/api/v1/api-keys` | API 키 관리 |

### 외부 Open API
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/open-api/v1/farms/{id}/safety-status` | 농가 안전 상태 요약 |
| GET | `/open-api/v1/alerts/stream` | 실시간 알림 스트림 (SSE) |
| POST | `/open-api/v1/sensor-data` | 외부 센서 데이터 수신 |
| GET | `/open-api/v1/statistics` | 안전 통계 데이터 |

### WebSocket 엔드포인트
| Endpoint | 설명 | 이벤트 |
|----------|------|--------|
| `/ws/dashboard` | 대시보드 실시간 | sensor_update, worker_status, alert_new, risk_change |
| `/ws/alerts` | 알림 실시간 | alert_created, alert_acknowledged, ecall_triggered |

## 4. 데이터 보존 정책

| 데이터 유형 | 원본 보존 | 집계 보존 | 비고 |
|------------|----------|----------|------|
| 센서 데이터 (SensorData) | 90일 | 1시간 집계 1년, 일별 집계 영구 | TimescaleDB 압축 정책 |
| 알림 (Alert) | 1년 | 통계만 영구 | |
| 사고 이력 (Accident) | 영구 | - | 법적 보존 의무 |
| AI 예측 (AIPrediction) | 90일 | 일별 집계 1년 | |
| 감사 로그 (AuditLog) | 90일 이상 | - | 삭제 불가 |
| CCTV 영상 | 30일 | 사고 관련 영상만 1년 | 별도 스토리지 |
