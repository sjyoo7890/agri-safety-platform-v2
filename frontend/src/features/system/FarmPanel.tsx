import { useEffect, useState } from 'react';
import { systemService, type FarmItem, type WorkplaceItem } from '@/services/systemService';
import { useAuthStore } from '@/stores/authStore';

const FARM_TYPE_LABELS: Record<string, string> = {
  open_field: '노지', livestock: '축산', orchard: '과수원', greenhouse: '시설원예',
};
const FARM_TYPES = Object.entries(FARM_TYPE_LABELS);

const WP_TYPE_LABELS: Record<string, string> = {
  open_field: '노지', greenhouse: '하우스', barn: '축사', orchard: '과수원', warehouse: '창고',
};
const WP_TYPES = Object.entries(WP_TYPE_LABELS);

/* ── 폼 초기값 ── */
const emptyFarm = { name: '', address: '', lat: 0, lng: 0, farmType: 'open_field', area: null as number | null, phone: '' };
type FarmForm = typeof emptyFarm;

const emptyWp = { name: '', type: 'open_field', lat: 0, lng: 0 };
type WpForm = typeof emptyWp;

export default function FarmPanel() {
  const currentUser = useAuthStore((s) => s.user);
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 농가 모달
  const [farmModal, setFarmModal] = useState(false);
  const [farmEditing, setFarmEditing] = useState<FarmItem | null>(null);
  const [farmForm, setFarmForm] = useState<FarmForm>({ ...emptyFarm });
  const [farmSaving, setFarmSaving] = useState(false);

  // 펼침 + 작업장
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null);
  const [workplaces, setWorkplaces] = useState<WorkplaceItem[]>([]);
  const [wpLoading, setWpLoading] = useState(false);

  // 작업장 모달
  const [wpModal, setWpModal] = useState(false);
  const [wpEditing, setWpEditing] = useState<WorkplaceItem | null>(null);
  const [wpForm, setWpForm] = useState<WpForm>({ ...emptyWp });
  const [wpSaving, setWpSaving] = useState(false);

  // 삭제 확인
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'farm' | 'wp'; id: string; farmId?: string; name: string } | null>(null);

  /* ── 농가 목록 조회 ── */
  const fetchFarms = async () => {
    setLoading(true);
    try { setFarms(await systemService.getFarms()); }
    catch (e) { console.error('농가 로드 실패:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFarms(); }, []);

  /* ── 검색 필터 ── */
  const filtered = farms.filter((f) => {
    const q = search.toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.address.toLowerCase().includes(q) || (FARM_TYPE_LABELS[f.farmType] ?? '').includes(q);
  });

  /* ── 농가 생성/수정 ── */
  const openFarmCreate = () => {
    setFarmEditing(null);
    setFarmForm({ ...emptyFarm });
    setFarmError('');
    setFarmModal(true);
  };

  const openFarmEdit = (f: FarmItem) => {
    setFarmEditing(f);
    setFarmForm({ name: f.name, address: f.address, lat: f.lat, lng: f.lng, farmType: f.farmType, area: f.area, phone: f.phone ?? '' });
    setFarmError('');
    setFarmModal(true);
  };

  const [farmError, setFarmError] = useState('');

  const saveFarm = async () => {
    setFarmSaving(true);
    setFarmError('');
    try {
      const payload: Record<string, unknown> = { ...farmForm };
      if (!payload.phone) delete payload.phone;
      if (payload.area === null || payload.area === 0) delete payload.area;
      if (!farmEditing) {
        payload.ownerId = currentUser?.id;
      }
      if (farmEditing) {
        await systemService.updateFarm(farmEditing.id, payload);
      } else {
        await systemService.createFarm(payload);
      }
      setFarmModal(false);
      await fetchFarms();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message;
      setFarmError(Array.isArray(msg) ? msg.join(', ') : msg || '농가 저장에 실패했습니다.');
    }
    finally { setFarmSaving(false); }
  };

  /* ── 농가 삭제 ── */
  const confirmDeleteFarm = async (id: string) => {
    try {
      await systemService.deleteFarm(id);
      if (expandedFarm === id) setExpandedFarm(null);
      await fetchFarms();
    } catch (e) { console.error('농가 삭제 실패:', e); alert('삭제 실패'); }
    finally { setDeleteTarget(null); }
  };

  /* ── 작업장 펼침 ── */
  const handleExpand = async (farmId: string) => {
    if (expandedFarm === farmId) { setExpandedFarm(null); return; }
    setExpandedFarm(farmId);
    await fetchWorkplaces(farmId);
  };

  const fetchWorkplaces = async (farmId: string) => {
    setWpLoading(true);
    try { setWorkplaces(await systemService.getWorkplaces(farmId)); }
    catch { setWorkplaces([]); }
    finally { setWpLoading(false); }
  };

  /* ── 작업장 생성/수정 ── */
  const [wpError, setWpError] = useState('');

  const openWpCreate = () => {
    setWpEditing(null);
    setWpForm({ ...emptyWp });
    setWpError('');
    setWpModal(true);
  };

  const openWpEdit = (wp: WorkplaceItem) => {
    setWpEditing(wp);
    setWpForm({ name: wp.name, type: wp.type, lat: wp.lat, lng: wp.lng });
    setWpError('');
    setWpModal(true);
  };

  const saveWp = async () => {
    if (!expandedFarm) return;
    setWpSaving(true);
    setWpError('');
    try {
      if (wpEditing) {
        await systemService.updateWorkplace(expandedFarm, wpEditing.id, wpForm);
      } else {
        await systemService.createWorkplace(expandedFarm, wpForm);
      }
      setWpModal(false);
      await fetchWorkplaces(expandedFarm);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message;
      setWpError(Array.isArray(msg) ? msg.join(', ') : msg || '작업장 저장에 실패했습니다.');
    }
    finally { setWpSaving(false); }
  };

  /* ── 작업장 삭제 ── */
  const confirmDeleteWp = async (farmId: string, id: string) => {
    try {
      await systemService.deleteWorkplace(farmId, id);
      await fetchWorkplaces(farmId);
    } catch (e) { console.error('작업장 삭제 실패:', e); alert('삭제 실패'); }
    finally { setDeleteTarget(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">농가 로딩 중...</div>;

  // 유형별 통계
  const typeCounts = farms.reduce<Record<string, number>>((acc, f) => {
    acc[f.farmType] = (acc[f.farmType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* 상단 통계 요약 */}
      <div className="flex items-center gap-6 pb-4 border-b">
        <div>
          <p className="text-xs text-gray-400">전체 농가</p>
          <p className="text-xl font-bold text-gray-900">{farms.length}</p>
        </div>
        {FARM_TYPES.map(([k, v]) => (
          <div key={k}>
            <p className="text-xs text-gray-400">{v}</p>
            <p className="text-lg font-semibold text-gray-700">{typeCounts[k] || 0}</p>
          </div>
        ))}
      </div>

      {/* 검색 + 등록 */}
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="농가명, 주소, 유형 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={openFarmCreate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + 농가 등록
        </button>
      </div>

      {/* 농가 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600 w-8"></th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">농가명</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">유형</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">주소</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">위도</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">경도</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">면적(㎡)</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">연락처</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <>
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => handleExpand(f.id)} className="text-xs text-gray-400 hover:text-gray-600">
                      {expandedFarm === f.id ? '▲' : '▼'}
                    </button>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">{f.name}</td>
                  <td className="text-center px-3 py-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      {FARM_TYPE_LABELS[f.farmType] ?? f.farmType}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{f.address}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{f.lat.toFixed(4)}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{f.lng.toFixed(4)}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{f.area ? f.area.toLocaleString() : '-'}</td>
                  <td className="px-3 py-2 text-gray-600">{f.phone ?? '-'}</td>
                  <td className="text-center px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openFarmEdit(f)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">수정</button>
                      <button onClick={() => setDeleteTarget({ type: 'farm', id: f.id, name: f.name })} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">삭제</button>
                    </div>
                  </td>
                </tr>
                {/* 작업장 목록 (펼침) */}
                {expandedFarm === f.id && (
                  <tr key={`${f.id}-wp`}>
                    <td colSpan={9} className="bg-gray-50 px-6 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-semibold text-gray-700">농작업장 목록</h5>
                        <button onClick={openWpCreate} className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">
                          + 작업장 추가
                        </button>
                      </div>
                      {wpLoading ? (
                        <div className="text-xs text-gray-400 py-2">로딩 중...</div>
                      ) : workplaces.length > 0 ? (
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left px-2 py-1.5 font-medium text-gray-500">작업장명</th>
                              <th className="text-center px-2 py-1.5 font-medium text-gray-500">유형</th>
                              <th className="text-right px-2 py-1.5 font-medium text-gray-500">위도</th>
                              <th className="text-right px-2 py-1.5 font-medium text-gray-500">경도</th>
                              <th className="text-center px-2 py-1.5 font-medium text-gray-500">지오펜스</th>
                              <th className="text-center px-2 py-1.5 font-medium text-gray-500">관리</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workplaces.map((wp) => (
                              <tr key={wp.id} className="border-b last:border-0 hover:bg-white">
                                <td className="px-2 py-1.5 font-medium text-gray-900">{wp.name}</td>
                                <td className="text-center px-2 py-1.5 text-gray-600">{WP_TYPE_LABELS[wp.type] ?? wp.type}</td>
                                <td className="text-right px-2 py-1.5 text-gray-600">{wp.lat.toFixed(4)}</td>
                                <td className="text-right px-2 py-1.5 text-gray-600">{wp.lng.toFixed(4)}</td>
                                <td className="text-center px-2 py-1.5">{wp.geofence ? <span className="text-blue-500">O</span> : <span className="text-gray-300">-</span>}</td>
                                <td className="text-center px-2 py-1.5">
                                  <button onClick={() => openWpEdit(wp)} className="text-blue-600 hover:underline mr-2">수정</button>
                                  <button onClick={() => setDeleteTarget({ type: 'wp', id: wp.id, farmId: f.id, name: wp.name })} className="text-red-600 hover:underline">삭제</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-xs text-gray-400">등록된 작업장이 없습니다.</div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <div className="text-center text-gray-400 py-12">{search ? '검색 결과가 없습니다.' : '등록된 농가가 없습니다.'}</div>}

      {/* ────── 농가 생성/수정 모달 ────── */}
      {farmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-base font-bold text-gray-900">{farmEditing ? '농가 수정' : '농가 등록'}</h3>
              <button onClick={() => setFarmModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {farmError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{farmError}</div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">농가명 *</label>
                <input type="text" value={farmForm.name} onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="예: 행복농장" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">유형 *</label>
                <select value={farmForm.farmType} onChange={(e) => setFarmForm({ ...farmForm, farmType: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {FARM_TYPES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">주소 *</label>
                <input type="text" value={farmForm.address} onChange={(e) => setFarmForm({ ...farmForm, address: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="예: 전남 나주시 ..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">위도 *</label>
                  <input type="number" step="any" value={farmForm.lat} onChange={(e) => setFarmForm({ ...farmForm, lat: Number(e.target.value) })}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">경도 *</label>
                  <input type="number" step="any" value={farmForm.lng} onChange={(e) => setFarmForm({ ...farmForm, lng: Number(e.target.value) })}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">면적 (㎡)</label>
                  <input type="number" value={farmForm.area ?? ''} onChange={(e) => setFarmForm({ ...farmForm, area: e.target.value ? Number(e.target.value) : null })}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">연락처</label>
                  <input type="text" value={farmForm.phone} onChange={(e) => setFarmForm({ ...farmForm, phone: e.target.value })}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="010-0000-0000" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setFarmModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button onClick={saveFarm} disabled={farmSaving || !farmForm.name || !farmForm.address}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {farmSaving ? '저장 중...' : farmEditing ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────── 작업장 생성/수정 모달 ────── */}
      {wpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-base font-bold text-gray-900">{wpEditing ? '작업장 수정' : '작업장 추가'}</h3>
              <button onClick={() => setWpModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {wpError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{wpError}</div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">작업장명 *</label>
                <input type="text" value={wpForm.name} onChange={(e) => setWpForm({ ...wpForm, name: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="예: A동 하우스" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">유형 *</label>
                <select value={wpForm.type} onChange={(e) => setWpForm({ ...wpForm, type: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {WP_TYPES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">위도 *</label>
                  <input type="number" step="any" value={wpForm.lat} onChange={(e) => setWpForm({ ...wpForm, lat: Number(e.target.value) })}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">경도 *</label>
                  <input type="number" step="any" value={wpForm.lng} onChange={(e) => setWpForm({ ...wpForm, lng: Number(e.target.value) })}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setWpModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button onClick={saveWp} disabled={wpSaving || !wpForm.name}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {wpSaving ? '저장 중...' : wpEditing ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────── 삭제 확인 모달 ────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {deleteTarget.type === 'farm' ? '농가 삭제' : '작업장 삭제'}
              </h3>
              <p className="text-sm text-gray-500">
                <strong>{deleteTarget.name}</strong>을(를) 삭제하시겠습니까?
                {deleteTarget.type === 'farm' && <><br />소속 작업장도 함께 삭제됩니다.</>}
              </p>
            </div>
            <div className="flex gap-2 px-6 pb-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button
                onClick={() => {
                  if (deleteTarget.type === 'farm') confirmDeleteFarm(deleteTarget.id);
                  else confirmDeleteWp(deleteTarget.farmId!, deleteTarget.id);
                }}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
