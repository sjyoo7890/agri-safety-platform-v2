-- TimescaleDB 하이퍼테이블 생성
-- TypeORM synchronize로 sensor_data 테이블 생성 후 수동 실행 필요

-- 확장 활성화
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 하이퍼테이블 변환
SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);

-- 보존 정책: 원본 90일
SELECT add_retention_policy('sensor_data', INTERVAL '90 days', if_not_exists => TRUE);

-- 압축 정책: 7일 이상 된 데이터 압축
ALTER TABLE sensor_data SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'sensor_id'
);
SELECT add_compression_policy('sensor_data', INTERVAL '7 days', if_not_exists => TRUE);

-- 1시간 집계 연속 집계 뷰
CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_data_hourly
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS bucket,
  sensor_id,
  AVG(value) AS avg_value,
  MIN(value) AS min_value,
  MAX(value) AS max_value,
  COUNT(*) AS sample_count
FROM sensor_data
GROUP BY bucket, sensor_id
WITH NO DATA;

SELECT add_continuous_aggregate_policy('sensor_data_hourly',
  start_offset => INTERVAL '3 hours',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour',
  if_not_exists => TRUE
);

-- 1시간 집계 보존: 1년
SELECT add_retention_policy('sensor_data_hourly', INTERVAL '1 year', if_not_exists => TRUE);

-- 일별 집계 연속 집계 뷰
CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_data_daily
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 day', time) AS bucket,
  sensor_id,
  AVG(value) AS avg_value,
  MIN(value) AS min_value,
  MAX(value) AS max_value,
  COUNT(*) AS sample_count
FROM sensor_data
GROUP BY bucket, sensor_id
WITH NO DATA;

SELECT add_continuous_aggregate_policy('sensor_data_daily',
  start_offset => INTERVAL '3 days',
  end_offset => INTERVAL '1 day',
  schedule_interval => INTERVAL '1 day',
  if_not_exists => TRUE
);
-- 일별 집계: 영구 보존 (retention 없음)
