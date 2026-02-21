import { useState } from 'react';
import type { RealtimePrediction } from '@/services/aiService';
import {
  PredictionRadarChart,
  XaiPanel,
  DraPanel,
  ModelPerformanceTable,
  RiskHistoryTable,
} from '@/features/ai';

type Tab = 'prediction' | 'dra' | 'performance' | 'history';

const TAB_LABELS: Record<Tab, string> = {
  prediction: 'AI 예측 현황',
  dra: '동적 위험성평가',
  performance: '모델 성능',
  history: '평가 이력',
};

export default function AIPage() {
  const [tab, setTab] = useState<Tab>('prediction');
  const [selectedPrediction, setSelectedPrediction] = useState<RealtimePrediction | null>(null);

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">AI 사고 예측 관리</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center px-6 pt-4 pb-2 border-b">
            <div className="flex gap-1">
              {(['prediction', 'dra', 'performance', 'history'] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                    tab === t ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {tab === 'prediction' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PredictionRadarChart onSelectPrediction={setSelectedPrediction} />
                <XaiPanel selectedPrediction={selectedPrediction} />
              </div>
            )}
            {tab === 'dra' && <DraPanel />}
            {tab === 'performance' && <ModelPerformanceTable />}
            {tab === 'history' && <RiskHistoryTable />}
          </div>
        </div>
      </div>
    </main>
  );
}
