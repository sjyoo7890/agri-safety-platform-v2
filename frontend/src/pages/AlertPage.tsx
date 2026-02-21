import { useState } from 'react';
import {
  AlertRulePanel,
  RecipientGroupPanel,
  EscalationRulePanel,
  AlertHistoryTable,
  AlertTemplatePanel,
  ECallPanel,
} from '@/features/alert';

type Tab = 'rules' | 'recipients' | 'ecall' | 'templates' | 'history';

const TAB_LABELS: Record<Tab, string> = {
  rules: '알림 규칙',
  recipients: '수신자 그룹',
  ecall: 'E-Call',
  templates: '템플릿',
  history: '이력',
};

export default function AlertPage() {
  const [tab, setTab] = useState<Tab>('rules');
  const farmId = undefined;

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">알림 및 비상 대응</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center px-6 pt-4 pb-2 border-b">
            <div className="flex gap-1">
              {(['rules', 'recipients', 'ecall', 'templates', 'history'] as Tab[]).map((t) => (
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
            {tab === 'rules' && (
              <>
                <AlertRulePanel farmId={farmId} />
                <EscalationRulePanel farmId={farmId} />
              </>
            )}
            {tab === 'recipients' && <RecipientGroupPanel farmId={farmId} />}
            {tab === 'ecall' && <ECallPanel farmId={farmId} />}
            {tab === 'templates' && <AlertTemplatePanel />}
            {tab === 'history' && <AlertHistoryTable />}
          </div>
        </div>
      </div>
    </main>
  );
}
