import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapData } from '@/services/dashboardService';
import { RISK_LEVEL_CONFIG } from '@/utils/constants';
import type { RiskLevel } from '@/types';

// Leaflet 기본 아이콘 수정 (webpack/vite 호환)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/** 위험 등급별 원형 마커 생성 */
function createCircleIcon(color: string, size = 10) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const SENSOR_ICON = createCircleIcon('#3B82F6', 8);

interface Props {
  mapData: MapData | null;
}

/** 한국 중부 기본 좌표 (대전) */
const DEFAULT_CENTER: [number, number] = [36.35, 127.38];
const DEFAULT_ZOOM = 7;

export default function DashboardMap({ mapData }: Props) {
  // 농장이 있으면 첫 번째 농장 좌표로 센터
  const center: [number, number] =
    mapData?.farms?.[0]
      ? [mapData.farms[0].lat, mapData.farms[0].lng]
      : DEFAULT_CENTER;
  const zoom = mapData?.farms?.length === 1 ? 14 : DEFAULT_ZOOM;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 농장 마커 */}
      {mapData?.farms?.map((farm) => {
        const riskColor =
          RISK_LEVEL_CONFIG[farm.riskLevel as RiskLevel]?.color || '#22C55E';
        return (
          <Marker
            key={`farm-${farm.id}`}
            position={[farm.lat, farm.lng]}
            icon={createCircleIcon(riskColor, 16)}
          >
            <Popup>
              <strong>{farm.name}</strong>
              <br />
              위험등급: {farm.riskLevel}
            </Popup>
          </Marker>
        );
      })}

      {/* 작업장 영역 (GeoFence 없으면 반경 50m 원) */}
      {mapData?.workplaces?.map((wp) => (
        <Circle
          key={`wp-${wp.id}`}
          center={[wp.lat, wp.lng]}
          radius={50}
          pathOptions={{
            color: '#6366F1',
            fillColor: '#6366F1',
            fillOpacity: 0.1,
            weight: 1,
          }}
        >
          <Popup>
            <strong>{wp.name}</strong>
            <br />
            유형: {wp.type}
          </Popup>
        </Circle>
      ))}

      {/* 작업자 마커 */}
      {mapData?.workers
        ?.filter((w) => w.lat !== 0 && w.lng !== 0)
        .map((worker) => {
          const riskColor =
            RISK_LEVEL_CONFIG[worker.riskLevel as RiskLevel]?.color || '#22C55E';
          return (
            <Marker
              key={`worker-${worker.id}`}
              position={[worker.lat, worker.lng]}
              icon={createCircleIcon(riskColor, 12)}
            >
              <Popup>
                <strong>{worker.name || '작업자'}</strong>
                <br />
                상태: {worker.status}
              </Popup>
            </Marker>
          );
        })}

      {/* 센서 마커 */}
      {mapData?.sensors
        ?.filter((s) => s.lat !== 0 && s.lng !== 0)
        .map((sensor) => (
          <Marker
            key={`sensor-${sensor.id}`}
            position={[sensor.lat, sensor.lng]}
            icon={SENSOR_ICON}
          >
            <Popup>
              <strong>{sensor.name}</strong>
              <br />
              상태: {sensor.status}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
