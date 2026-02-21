import { useEffect, useState } from 'react';
import { alertService, type AlertTemplate } from '@/services/alertService';

const TYPE_LABELS: Record<string, string> = {
  FALL: '추락/넘어짐',
  ENTANGLE: '끼임/감김',
  HEAT: '온열질환/질식',
  FIRE: '전기화재',
  ROLLOVER: '차량 전도/전복',
  COLLISION: '농기계-작업자 충돌',
  DEVICE: '디바이스',
  SYSTEM: '시스템',
};

const SEVERITY_LABELS: Record<string, string> = {
  info: '정보',
  caution: '주의',
  warning: '경고',
  danger: '위험',
};

export default function AlertTemplatePanel() {
  const [templates, setTemplates] = useState<AlertTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AlertTemplate> | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await alertService.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('템플릿 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await alertService.updateTemplate(editing.id, editing);
      } else {
        await alertService.createTemplate(editing);
      }
      setEditing(null);
      await fetchTemplates();
    } catch (err) {
      console.error('템플릿 저장 실패:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await alertService.deleteTemplate(id);
      await fetchTemplates();
    } catch (err) {
      console.error('템플릿 삭제 실패:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">알림 메시지 템플릿</h3>
        <button
          onClick={() => setEditing({ alertType: 'FALL', severity: 'warning', title: '', messageTemplate: '', isActive: true })}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + 템플릿 추가
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">사고유형</th>
              <th className="text-center px-4 py-2 border-b font-medium text-gray-600">등급</th>
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">제목</th>
              <th className="text-left px-4 py-2 border-b font-medium text-gray-600">메시지 템플릿</th>
              <th className="text-center px-4 py-2 border-b font-medium text-gray-600">상태</th>
              <th className="text-center px-4 py-2 border-b font-medium text-gray-600">액션</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{TYPE_LABELS[t.alertType] ?? t.alertType}</td>
                <td className="text-center px-4 py-2 border-b">{SEVERITY_LABELS[t.severity] ?? t.severity}</td>
                <td className="px-4 py-2 border-b font-medium">{t.title}</td>
                <td className="px-4 py-2 border-b text-gray-600 max-w-xs truncate">{t.messageTemplate}</td>
                <td className="text-center px-4 py-2 border-b">
                  <span className={`text-xs px-2 py-0.5 rounded ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="text-center px-4 py-2 border-b">
                  <button onClick={() => setEditing(t)} className="text-xs text-blue-600 hover:text-blue-800 mr-2">수정</button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs text-red-600 hover:text-red-800">삭제</button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">등록된 템플릿이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 편집 모달 */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editing.id ? '템플릿 수정' : '템플릿 추가'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사고유형</label>
                  <select
                    value={editing.alertType ?? 'FALL'}
                    onChange={(e) => setEditing({ ...editing, alertType: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    {Object.entries(TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={editing.title ?? ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메시지 템플릿</label>
                <textarea
                  value={editing.messageTemplate ?? ''}
                  onChange={(e) => setEditing({ ...editing, messageTemplate: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm h-24"
                  placeholder="{{workerName}}님, {{farmName}}에서 {{accidentType}} 위험이 감지되었습니다."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TTS 템플릿 (선택)</label>
                <textarea
                  value={editing.ttsTemplate ?? ''}
                  onChange={(e) => setEditing({ ...editing, ttsTemplate: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm h-20"
                />
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
