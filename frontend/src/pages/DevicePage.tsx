import { useEffect, useState, useCallback } from 'react';
import {
  deviceService,
  type SmartVest,
  type EmergencyKit,
  type Sensor,
} from '@/services/deviceService';
import {
  SmartVestTable,
  EmergencyKitTable,
  SensorTable,
  DeviceRegisterModal,
  SensorDataChart,
} from '@/features/device';

type Tab = 'vest' | 'kit' | 'sensor';

const TAB_LABELS: Record<Tab, string> = {
  vest: '스마트 조끼',
  kit: '응급키트',
  sensor: '환경센서',
};

export default function DevicePage() {
  const [tab, setTab] = useState<Tab>('vest');
  const [loading, setLoading] = useState(true);

  const [vests, setVests] = useState<SmartVest[]>([]);
  const [kits, setKits] = useState<EmergencyKit[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, unknown> | null>(null);
  const [chartSensor, setChartSensor] = useState<Sensor | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [v, k, s] = await Promise.all([
        deviceService.getVests(),
        deviceService.getKits(),
        deviceService.getSensors(),
      ]);
      setVests(v);
      setKits(k);
      setSensors(s);
    } catch (err) {
      console.error('디바이스 데이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenCreate = () => { setEditData(null); setModalOpen(true); };

  const handleEdit = (data: Record<string, unknown>) => { setEditData(data); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      if (tab === 'vest') await deviceService.deleteVest(id);
      else if (tab === 'kit') await deviceService.deleteKit(id);
      else await deviceService.deleteSensor(id);
      fetchData();
    } catch (err) { console.error('삭제 실패:', err); }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editData) {
        const id = editData.id as string;
        if (tab === 'vest') await deviceService.updateVest(id, data);
        else if (tab === 'kit') await deviceService.updateKit(id, data);
        else await deviceService.updateSensor(id, data);
      } else {
        if (tab === 'vest') await deviceService.createVest(data);
        else if (tab === 'kit') await deviceService.createKit(data);
        else await deviceService.createSensor(data);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) { console.error('저장 실패:', err); }
  };

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">IoT 디바이스 관리</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b">
            <div className="flex gap-1">
              {(['vest', 'kit', 'sensor'] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                    tab === t ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {TAB_LABELS[t]}
                  <span className="ml-1.5 text-xs text-gray-400">
                    ({t === 'vest' ? vests.length : t === 'kit' ? kits.length : sensors.length})
                  </span>
                </button>
              ))}
            </div>
            <button onClick={handleOpenCreate} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">+ 등록</button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-gray-400">데이터를 불러오는 중...</div>
            ) : (
              <>
                {tab === 'vest' && <SmartVestTable vests={vests} onEdit={(v) => handleEdit(v as unknown as Record<string, unknown>)} onDelete={handleDelete} />}
                {tab === 'kit' && <EmergencyKitTable kits={kits} onEdit={(k) => handleEdit(k as unknown as Record<string, unknown>)} onDelete={handleDelete} />}
                {tab === 'sensor' && <SensorTable sensors={sensors} onEdit={(s) => handleEdit(s as unknown as Record<string, unknown>)} onDelete={handleDelete} onViewData={(s) => setChartSensor(s)} />}
              </>
            )}
          </div>
        </div>
      </div>

      <DeviceRegisterModal tab={tab} editData={editData} open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      {chartSensor && <SensorDataChart sensor={chartSensor} onClose={() => setChartSensor(null)} />}
    </main>
  );
}
