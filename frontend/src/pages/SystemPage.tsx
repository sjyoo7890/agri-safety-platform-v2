import { useState } from 'react';
import {
  UserPanel,
  FarmPanel,
  AssetPanel,
  SettingsPanel,
  ApiKeyPanel,
  AuditLogPanel,
} from '@/features/system';

type Tab = 'users' | 'farms' | 'assets' | 'settings' | 'apiKeys' | 'auditLogs';

const TAB_LABELS: Record<Tab, string> = {
  users: '사용자 관리',
  farms: '농가/작업장',
  assets: '장비 자산',
  settings: '시스템 설정',
  apiKeys: 'API 관리',
  auditLogs: '감사 로그',
};

export default function SystemPage() {
  const [tab, setTab] = useState<Tab>('users');

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">시스템 관리</h1>
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
            {tab === 'users' && <UserPanel />}
            {tab === 'farms' && <FarmPanel />}
            {tab === 'assets' && <AssetPanel />}
            {tab === 'settings' && <SettingsPanel />}
            {tab === 'apiKeys' && <ApiKeyPanel />}
            {tab === 'auditLogs' && <AuditLogPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}
