import { useState, useCallback } from 'react';
import type { AccidentRecord } from '@/services/reportService';
import {
  AccidentHistoryTable,
  AccidentFormModal,
  StatisticsDashboard,
} from '@/features/report';

type Tab = 'history' | 'statistics';

const TAB_LABELS: Record<Tab, string> = {
  history: '사고 이력',
  statistics: '통계 대시보드',
};

export default function ReportPage() {
  const [tab, setTab] = useState<Tab>('statistics');

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<AccidentRecord | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (record: AccidentRecord) => { setEditData(record); setModalOpen(true); };
  const handleSaved = useCallback(() => { setRefreshKey((k) => k + 1); }, []);

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">사고 이력 및 분석 리포트</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b">
            <div className="flex gap-1">
              {(['statistics', 'history'] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                    tab === t ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
            {tab === 'history' && (
              <button onClick={handleCreate} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">+ 사고 등록</button>
            )}
          </div>

          <div className="p-6">
            {tab === 'statistics' && <StatisticsDashboard />}
            {tab === 'history' && <AccidentHistoryTable key={refreshKey} onEdit={handleEdit} />}
          </div>
        </div>
      </div>

      <AccidentFormModal open={modalOpen} editData={editData} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
    </main>
  );
}
