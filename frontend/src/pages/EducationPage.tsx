import { useState } from 'react';
import {
  ContentPanel,
  ProgressPanel,
  AnalysisPanel,
  SchedulePanel,
  SimulatorPanel,
  KitTrainingPanel,
} from '@/features/education';

type Tab = 'contents' | 'progress' | 'analysis' | 'schedule' | 'simulator' | 'kit';

const TAB_LABELS: Record<Tab, string> = {
  contents: '콘텐츠 관리',
  progress: '이수 현황',
  analysis: '성취도 분석',
  schedule: '일정',
  simulator: '시뮬레이터',
  kit: '키트 실습',
};

export default function EducationPage() {
  const [tab, setTab] = useState<Tab>('contents');

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">안전교육 관리</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center gap-1 px-6 pt-4 pb-2 border-b overflow-x-auto">
            {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
                  tab === t ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'contents' && <ContentPanel />}
            {tab === 'progress' && <ProgressPanel />}
            {tab === 'analysis' && <AnalysisPanel />}
            {tab === 'schedule' && <SchedulePanel />}
            {tab === 'simulator' && <SimulatorPanel />}
            {tab === 'kit' && <KitTrainingPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}
