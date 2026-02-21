import { useEffect, useState } from 'react';
import { systemService, type UserItem } from '@/services/systemService';

const ROLE_LABELS: Record<string, string> = {
  admin: '시스템 관리자', farm_manager: '농장 관리자', govt_manager: '지자체 관리자',
  edu_manager: '교육 관리자', worker: '작업자',
};
const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700', farm_manager: 'bg-blue-100 text-blue-700',
  govt_manager: 'bg-teal-100 text-teal-700', edu_manager: 'bg-indigo-100 text-indigo-700',
  worker: 'bg-gray-100 text-gray-700',
};

const INITIAL_FORM = { name: '', email: '', password: '', role: 'worker', phone: '', farmId: '' };

export default function UserPanel() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');

  // 등록/수정 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // 삭제 확인 모달
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try { setUsers(await systemService.getUsers()); }
    catch (e) { console.error('사용자 로드 실패:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ── 에러 메시지 추출 헬퍼 ── */
  const extractError = (e: unknown, fallback: string) => {
    const err = e as { response?: { data?: { message?: string | string[] } } };
    const msg = err.response?.data?.message;
    return Array.isArray(msg) ? msg.join(', ') : msg || fallback;
  };

  /* ── 등록 모달 열기 ── */
  const openCreate = () => {
    setEditingUser(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setModalOpen(true);
  };

  /* ── 수정 모달 열기 ── */
  const openEdit = (u: UserItem) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      phone: u.phone ?? '',
      farmId: u.farmId ?? '',
    });
    setFormError('');
    setModalOpen(true);
  };

  /* ── 저장 (등록/수정 공용) ── */
  const handleSave = async () => {
    setFormError('');
    setSaving(true);
    try {
      if (editingUser) {
        // 수정
        const payload: Record<string, unknown> = {};
        if (form.name && form.name !== editingUser.name) payload.name = form.name;
        if (form.role && form.role !== editingUser.role) payload.role = form.role;
        if (form.phone !== (editingUser.phone ?? '')) payload.phone = form.phone || undefined;
        if (form.farmId !== (editingUser.farmId ?? '')) payload.farmId = form.farmId || undefined;
        if (form.password) payload.password = form.password;
        await systemService.updateUser(editingUser.id, payload);
      } else {
        // 등록
        const payload: Record<string, unknown> = { ...form };
        if (!payload.farmId) delete payload.farmId;
        if (!payload.phone) delete payload.phone;
        await systemService.createUser(payload as Parameters<typeof systemService.createUser>[0]);
      }
      setModalOpen(false);
      setForm(INITIAL_FORM);
      setEditingUser(null);
      fetchUsers();
    } catch (e: unknown) {
      setFormError(extractError(e, editingUser ? '사용자 수정에 실패했습니다.' : '사용자 등록에 실패했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  /* ── 삭제 (비활성화) ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await systemService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (e) {
      console.error('사용자 삭제 실패:', e);
      alert(extractError(e, '사용자 삭제에 실패했습니다.'));
      setDeleteTarget(null);
    }
  };

  /* ── 활성화 복원 ── */
  const handleRestore = async (u: UserItem) => {
    try {
      await systemService.updateUser(u.id, { isActive: true });
      fetchUsers();
    } catch (e) { console.error('활성화 실패:', e); }
  };

  const filtered = users.filter((u) => {
    if (filterRole && u.role !== filterRole) return false;
    if (search) {
      const s = search.toLowerCase();
      return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    }
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">사용자 로딩 중...</div>;

  const isEditMode = !!editingUser;

  return (
    <div className="space-y-4">
      {/* 검색 + 필터 + 등록 버튼 */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="이름/이메일 검색" className="border rounded-md px-3 py-2 text-sm w-60"
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm">
          <option value="">전체 역할</option>
          {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={openCreate}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">+ 사용자 등록</button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-600">이름</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">이메일</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">역할</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">연락처</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">상태</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">가입일</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{u.name}</td>
                <td className="px-3 py-2 text-gray-600">{u.email}</td>
                <td className="text-center px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_STYLES[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-600">{u.phone ?? '-'}</td>
                <td className="text-center px-3 py-2">
                  {u.isActive
                    ? <span className="text-xs text-green-600 font-medium">활성</span>
                    : <span className="text-xs text-gray-400 font-medium">비활성</span>
                  }
                </td>
                <td className="text-center px-3 py-2 text-gray-500 text-xs">{u.createdAt?.slice(0, 10)}</td>
                <td className="text-center px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(u)}
                      className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50">수정</button>
                    {u.isActive ? (
                      <button onClick={() => setDeleteTarget(u)}
                        className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50">삭제</button>
                    ) : (
                      <button onClick={() => handleRestore(u)}
                        className="text-xs px-2 py-1 rounded text-green-600 hover:bg-green-50">활성화</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <div className="text-center text-gray-400 py-8">사용자가 없습니다.</div>}

      {/* ────── 등록/수정 모달 ────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-base font-bold text-gray-900">{isEditMode ? '사용자 수정' : '사용자 등록'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-3">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isEditMode}
                  className="w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 {isEditMode ? '(변경 시에만 입력)' : '*'}
                </label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm" placeholder="영문 대소문자+숫자+특수문자 8자 이상" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">역할 *</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm">
                    {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소속 농가 ID (선택)</label>
                <input type="text" value={form.farmId} onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm" placeholder="UUID" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={saving || !form.name || (!isEditMode && (!form.email || !form.password))}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? '저장 중...' : isEditMode ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────── 삭제 확인 모달 ────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">사용자 삭제</h3>
              <p className="text-sm text-gray-500">
                <strong>{deleteTarget.name}</strong> ({deleteTarget.email})을(를) 비활성화하시겠습니까?
              </p>
              <p className="text-xs text-gray-400 mt-1">비활성화된 사용자는 로그인할 수 없습니다.</p>
            </div>
            <div className="flex gap-2 px-6 pb-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">취소</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
