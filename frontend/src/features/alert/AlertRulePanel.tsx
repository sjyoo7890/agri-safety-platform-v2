import { useEffect, useState } from 'react';
import { alertService, type AlertRule } from '@/services/alertService';

const SEVERITIES = ['caution', 'warning', 'danger'] as const;
const SEVERITY_LABELS: Record<string, string> = {
  caution: '주의',
  warning: '경고',
  danger: '위험',
};
const SEVERITY_COLORS: Record<string, string> = {
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-800',
};
const CHANNELS = ['dashboard', 'push', 'sms', 'vest', 'beacon'] as const;
const CHANNEL_LABELS: Record<string, string> = {
  dashboard: '대시보드',
  push: '앱 푸시',
  sms: 'SMS',
  vest: '조끼 진동',
  beacon: '경광등',
};

interface Props {
  farmId?: string;
}

export default function AlertRulePanel({ farmId }: Props) {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 등급별 채널 상태 (UI 전용)
  const [matrix, setMatrix] = useState<Record<string, Set<string>>>({
    caution: new Set<string>(),
    warning: new Set<string>(),
    danger: new Set<string>(),
  });

  useEffect(() => {
    fetchRules();
  }, [farmId]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAlertRules(farmId);
      setRules(data);
      // 매트릭스 초기화
      const m: Record<string, Set<string>> = {
        caution: new Set<string>(),
        warning: new Set<string>(),
        danger: new Set<string>(),
      };
      data.forEach((r) => {
        if (m[r.severity]) {
          r.channels.forEach((ch) => m[r.severity].add(ch));
        }
      });
      setMatrix(m);
    } catch (err) {
      console.error('알림 규칙 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleChannel = (severity: string, channel: string) => {
    setMatrix((prev) => {
      const next = { ...prev };
      const set = new Set(next[severity]);
      if (set.has(channel)) set.delete(channel);
      else set.add(channel);
      next[severity] = set;
      return next;
    });
  };

  const handleSave = async () => {
    if (!farmId) return;
    setSaving(true);
    try {
      const ruleItems = SEVERITIES.map((sev) => {
        const existing = rules.find((r) => r.severity === sev);
        return {
          id: existing?.id,
          severity: sev,
          channels: Array.from(matrix[sev]),
        };
      });
      await alertService.upsertAlertRules(farmId, ruleItems);
      await fetchRules();
    } catch (err) {
      console.error('알림 규칙 저장 실패:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">등급별 알림 채널 설정</h3>
        <button
          onClick={handleSave}
          disabled={saving || !farmId}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>

      {!farmId && (
        <p className="text-sm text-amber-600 mb-4">농가를 선택하면 규칙을 편집할 수 있습니다.</p>
      )}

      {/* 채널 매트릭스 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 border-b font-medium text-gray-600">등급</th>
              {CHANNELS.map((ch) => (
                <th key={ch} className="text-center px-4 py-3 border-b font-medium text-gray-600">
                  {CHANNEL_LABELS[ch]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SEVERITIES.map((sev) => (
              <tr key={sev} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[sev]}`}>
                    {SEVERITY_LABELS[sev]}
                  </span>
                </td>
                {CHANNELS.map((ch) => (
                  <td key={ch} className="text-center px-4 py-3 border-b">
                    <input
                      type="checkbox"
                      checked={matrix[sev].has(ch)}
                      onChange={() => toggleChannel(sev, ch)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
