import { useEffect, useState } from 'react';
import { alertService, type EscalationRule } from '@/services/alertService';

const SEVERITY_LABELS: Record<string, string> = {
  caution: '주의',
  warning: '경고',
  danger: '위험',
};

const TARGET_LABELS: Record<string, string> = {
  upper_manager: '상위 관리자',
  emergency_119: '119 신고',
  emergency_112: '112 신고',
};

interface Props {
  farmId?: string;
}

export default function EscalationRulePanel({ farmId }: Props) {
  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, [farmId]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await alertService.getEscalationRules(farmId);
      setRules(data);
    } catch (err) {
      console.error('에스컬레이션 규칙 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-32 text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4">에스컬레이션 규칙</h3>

      {rules.length === 0 ? (
        <p className="text-sm text-gray-400">등록된 에스컬레이션 규칙이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">등급</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">단계</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">대기시간(분)</th>
                <th className="text-left px-4 py-2 border-b font-medium text-gray-600">대상</th>
                <th className="text-center px-4 py-2 border-b font-medium text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{SEVERITY_LABELS[r.severity] ?? r.severity}</td>
                  <td className="text-center px-4 py-2 border-b">{r.step}</td>
                  <td className="text-center px-4 py-2 border-b">{r.waitMinutes}분</td>
                  <td className="px-4 py-2 border-b">{TARGET_LABELS[r.targetType] ?? r.targetType}</td>
                  <td className="text-center px-4 py-2 border-b">
                    <span className={`text-xs px-2 py-0.5 rounded ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
