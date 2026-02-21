import { useEffect, useState } from 'react';
import { systemService, type SettingItem } from '@/services/systemService';

const GROUP_LABELS: Record<string, string> = {
  alert: '알림 설정', data: '데이터 관리', system: '시스템', integration: '외부 연동',
};

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setSettings(await systemService.getSettings()); }
      catch (e) { console.error('설정 로드 실패:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const changes = Object.entries(edited).map(([key, value]) => ({ key, value }));
    if (changes.length === 0) return;
    setSaving(true);
    try {
      const updated = await systemService.updateSettings(changes);
      setSettings(updated);
      setEdited({});
    } catch (e) { console.error('설정 저장 실패:', e); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">설정 로딩 중...</div>;

  // 그룹별 분류
  const groups = new Map<string, SettingItem[]>();
  settings.forEach((s) => {
    const list = groups.get(s.group) ?? [];
    list.push(s);
    groups.set(s.group, list);
  });

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([group, items]) => (
        <div key={group} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h4 className="text-sm font-semibold text-gray-700">{GROUP_LABELS[group] ?? group}</h4>
          </div>
          <div className="divide-y">
            {items.map((s) => {
              const currentValue = edited[s.key] ?? s.value;
              return (
                <div key={s.key} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{s.key}</div>
                    {s.description && <div className="text-xs text-gray-400">{s.description}</div>}
                  </div>
                  <div className="w-48">
                    {s.valueType === 'boolean' ? (
                      <select value={currentValue} onChange={(e) => handleChange(s.key, e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm">
                        <option value="true">활성</option>
                        <option value="false">비활성</option>
                      </select>
                    ) : (
                      <input type={s.valueType === 'number' ? 'number' : 'text'}
                        value={currentValue} onChange={(e) => handleChange(s.key, e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400 w-20 text-right">{s.valueType}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {hasChanges && (
        <div className="flex justify-end">
          <button onClick={() => setEdited({})} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 mr-2">취소</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      )}

      {settings.length === 0 && <div className="text-center text-gray-400 py-12">설정 항목이 없습니다.</div>}
    </div>
  );
}
