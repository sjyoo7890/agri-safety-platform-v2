import { useEffect, useState, useCallback } from 'react';
import { systemService, type AuditLogItem, type AuditLogQuery } from '@/services/systemService';

const ACTION_STYLES: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<AuditLogQuery>({ page: 1, limit: 20 });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await systemService.getAuditLogs(query);
      setLogs(result.data);
      setTotal(result.total);
    } catch (e) { console.error('감사 로그 로드 실패:', e); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / (query.limit ?? 20));

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex items-center gap-3 flex-wrap">
        <input type="text" placeholder="사용자 ID"
          value={query.userId ?? ''} onChange={(e) => setQuery({ ...query, userId: e.target.value || undefined, page: 1 })}
          className="border rounded-md px-3 py-2 text-sm w-48" />
        <input type="text" placeholder="리소스 (users, farms...)"
          value={query.resource ?? ''} onChange={(e) => setQuery({ ...query, resource: e.target.value || undefined, page: 1 })}
          className="border rounded-md px-3 py-2 text-sm w-48" />
        <input type="date" value={query.from ?? ''} onChange={(e) => setQuery({ ...query, from: e.target.value || undefined, page: 1 })}
          className="border rounded-md px-3 py-2 text-sm" />
        <span className="text-gray-400">~</span>
        <input type="date" value={query.to ?? ''} onChange={(e) => setQuery({ ...query, to: e.target.value || undefined, page: 1 })}
          className="border rounded-md px-3 py-2 text-sm" />
        <div className="flex-1" />
        <span className="text-xs text-gray-400">총 {total}건</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">시간</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">사용자</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">액션</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">리소스</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">리소스 ID</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">IP</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">상태</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">응답(ms)</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const method = log.action?.split(' ')[0] ?? '';
                  return (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600 text-xs whitespace-nowrap">
                        {log.createdAt?.slice(0, 19).replace('T', ' ')}
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-xs">{log.userEmail ?? log.userId?.slice(0, 8) ?? '-'}</td>
                      <td className="text-center px-3 py-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${ACTION_STYLES[method] ?? 'bg-gray-100 text-gray-600'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700 text-xs font-medium">{log.resource}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs font-mono">{log.resourceId?.slice(0, 8) ?? '-'}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{log.ip ?? '-'}</td>
                      <td className="text-center px-3 py-2">
                        {log.statusCode && (
                          <span className={`text-xs font-medium ${log.statusCode < 400 ? 'text-green-600' : log.statusCode < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {log.statusCode}
                          </span>
                        )}
                      </td>
                      <td className="text-center px-3 py-2 text-gray-500 text-xs">{log.durationMs ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setQuery({ ...query, page: Math.max(1, (query.page ?? 1) - 1) })}
                disabled={(query.page ?? 1) <= 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-30 hover:bg-gray-50">이전</button>
              <span className="text-sm text-gray-600">{query.page ?? 1} / {totalPages}</span>
              <button onClick={() => setQuery({ ...query, page: Math.min(totalPages, (query.page ?? 1) + 1) })}
                disabled={(query.page ?? 1) >= totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-30 hover:bg-gray-50">다음</button>
            </div>
          )}

          {logs.length === 0 && <div className="text-center text-gray-400 py-8">감사 로그가 없습니다.</div>}
        </>
      )}
    </div>
  );
}
