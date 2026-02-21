import { useEffect, useState } from 'react';
import { alertService, type AlertRecipient } from '@/services/alertService';

const SEVERITY_LABELS: Record<string, string> = {
  info: '정보',
  caution: '주의',
  warning: '경고',
  danger: '위험',
};

interface Props {
  farmId?: string;
}

export default function RecipientGroupPanel({ farmId }: Props) {
  const [recipients, setRecipients] = useState<AlertRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AlertRecipient> | null>(null);

  useEffect(() => {
    fetchRecipients();
  }, [farmId]);

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const data = await alertService.getRecipients(farmId);
      setRecipients(data);
    } catch (err) {
      console.error('수신자 그룹 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await alertService.updateRecipient(editing.id, editing);
      } else {
        await alertService.createRecipient(editing);
      }
      setEditing(null);
      await fetchRecipients();
    } catch (err) {
      console.error('수신자 그룹 저장 실패:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await alertService.deleteRecipient(id);
      await fetchRecipients();
    } catch (err) {
      console.error('수신자 그룹 삭제 실패:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">수신자 그룹 관리</h3>
        <button
          onClick={() => setEditing({ farmId, name: '', severity: 'warning', userIds: [], includeExternal: false })}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + 그룹 추가
        </button>
      </div>

      {/* 그룹 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipients.map((r) => (
          <div key={r.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{r.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {SEVERITY_LABELS[r.severity] ?? r.severity}
              </span>
            </div>
            {r.alertType && (
              <p className="text-xs text-gray-500 mb-1">사고유형: {r.alertType}</p>
            )}
            <p className="text-xs text-gray-500 mb-2">수신자 {r.userIds.length}명</p>
            {r.includeExternal && (
              <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">119/112 포함</span>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(r)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        {recipients.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">등록된 수신자 그룹이 없습니다.</p>
        )}
      </div>

      {/* 편집 모달 */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">{editing.id ? '그룹 수정' : '그룹 추가'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">그룹명</label>
                <input
                  type="text"
                  value={editing.name ?? ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">위험등급</label>
                <select
                  value={editing.severity ?? 'warning'}
                  onChange={(e) => setEditing({ ...editing, severity: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="caution">주의</option>
                  <option value="warning">경고</option>
                  <option value="danger">위험</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수신자 ID (쉼표 구분)
                </label>
                <input
                  type="text"
                  value={(editing.userIds ?? []).join(', ')}
                  onChange={(e) =>
                    setEditing({ ...editing, userIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="UUID1, UUID2, ..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.includeExternal ?? false}
                  onChange={(e) => setEditing({ ...editing, includeExternal: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">119/112 외부기관 포함</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
