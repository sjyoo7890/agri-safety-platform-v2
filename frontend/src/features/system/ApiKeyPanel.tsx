import { useEffect, useState } from 'react';
import { systemService, type ApiKeyItem } from '@/services/systemService';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  revoked: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-500',
};
const STATUS_LABELS: Record<string, string> = { active: '활성', revoked: '폐기', expired: '만료' };

const INITIAL_FORM = { name: '', description: '', allowedIps: '', rateLimit: '1000', expiresAt: '' };

export default function ApiKeyPanel() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try { setKeys(await systemService.getApiKeys()); }
    catch (e) { console.error('API 키 로드 실패:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async () => {
    try {
      const result = await systemService.createApiKey({
        name: form.name,
        description: form.description || undefined,
        allowedIps: form.allowedIps ? form.allowedIps.split(',').map((s) => s.trim()) : undefined,
        rateLimit: parseInt(form.rateLimit) || 1000,
        expiresAt: form.expiresAt || undefined,
      });
      setCreatedKey((result as any).plainKey ?? null);
      setForm(INITIAL_FORM);
      fetchKeys();
    } catch (e) { console.error('API 키 생성 실패:', e); }
  };

  const handleRevoke = async (id: string) => {
    try { await systemService.revokeApiKey(id); fetchKeys(); }
    catch (e) { console.error('API 키 폐기 실패:', e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">API 키 로딩 중...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setModalOpen(true); setCreatedKey(null); }}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">+ API 키 발급</button>
      </div>

      {/* 키 목록 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600">이름</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">키 (prefix)</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">상태</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">요청 제한</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">총 요청</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">만료일</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="font-medium text-gray-900">{k.name}</div>
                  {k.description && <div className="text-xs text-gray-400">{k.description}</div>}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-600">{k.keyPrefix}...</td>
                <td className="text-center px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[k.status] ?? ''}`}>
                    {STATUS_LABELS[k.status] ?? k.status}
                  </span>
                </td>
                <td className="text-center px-3 py-2 text-gray-600 text-xs">{k.rateLimit}/hr</td>
                <td className="text-center px-3 py-2 text-gray-600 text-xs">{k.totalRequests.toLocaleString()}</td>
                <td className="text-center px-3 py-2 text-gray-500 text-xs">{k.expiresAt?.slice(0, 10) ?? '없음'}</td>
                <td className="text-center px-3 py-2">
                  {k.status === 'active' && (
                    <button onClick={() => handleRevoke(k.id)}
                      className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded">폐기</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {keys.length === 0 && <div className="text-center text-gray-400 py-8">발급된 API 키가 없습니다.</div>}

      {/* 발급 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">API 키 발급</h3>

            {createdKey ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="text-xs text-green-700 mb-1">생성된 API 키 (이 창을 닫으면 다시 볼 수 없습니다)</div>
                  <div className="font-mono text-sm text-green-900 break-all select-all">{createdKey}</div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => { setModalOpen(false); setCreatedKey(null); }}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">확인</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">키 이름</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm" placeholder="예: 농기계 제조사 연동" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명 (선택)</label>
                  <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">허용 IP (쉼표 구분)</label>
                  <input type="text" value={form.allowedIps} onChange={(e) => setForm({ ...form, allowedIps: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm" placeholder="예: 192.168.1.1, 10.0.0.0/24" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">요청 제한 (/hr)</label>
                    <input type="number" value={form.rateLimit} onChange={(e) => setForm({ ...form, rateLimit: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">만료일 (선택)</label>
                    <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">취소</button>
                  <button onClick={handleCreate} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">발급</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
