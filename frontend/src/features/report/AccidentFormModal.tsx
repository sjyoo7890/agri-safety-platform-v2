import { useState, useEffect } from 'react';
import { reportService, type AccidentRecord } from '@/services/reportService';

const TYPE_OPTIONS = [
  { value: 'FALL', label: '추락/넘어짐' },
  { value: 'ENTANGLE', label: '끼임/감김' },
  { value: 'HEAT', label: '온열질환/질식' },
  { value: 'FIRE', label: '전기화재' },
  { value: 'ROLLOVER', label: '차량 전도/전복' },
  { value: 'COLLISION', label: '농기계-작업자 충돌' },
  { value: 'OTHER', label: '기타' },
];

const SEVERITY_OPTIONS = [
  { value: 'minor', label: '경미' },
  { value: 'moderate', label: '보통' },
  { value: 'severe', label: '중대' },
  { value: 'fatal', label: '사망' },
];

interface Props {
  open: boolean;
  editData: AccidentRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AccidentFormModal({ open, editData, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (editData) {
      setForm({
        type: editData.type,
        severity: editData.severity,
        occurredAt: editData.occurredAt?.slice(0, 16) ?? '',
        farmId: editData.farmId,
        description: editData.description ?? '',
        cause: editData.cause ?? '',
        actionsTaken: editData.actionsTaken ?? '',
        isNearMiss: editData.isNearMiss,
      });
    } else {
      setForm({
        type: 'FALL',
        severity: 'minor',
        occurredAt: new Date().toISOString().slice(0, 16),
        farmId: '',
        description: '',
        cause: '',
        actionsTaken: '',
        isNearMiss: false,
      });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      if (editData) {
        await reportService.updateAccident(editData.id, form as Partial<AccidentRecord>);
      } else {
        await reportService.createAccident(form as Partial<AccidentRecord>);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{editData ? '사고 이력 수정' : '사고/아차사고 등록'}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사고유형</label>
              <select
                value={(form.type as string) ?? 'FALL'}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">심각도</label>
              <select
                value={(form.severity as string) ?? 'minor'}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {SEVERITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">발생 일시</label>
            <input
              type="datetime-local"
              value={(form.occurredAt as string) ?? ''}
              onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">농가 ID</label>
            <input
              type="text"
              value={(form.farmId as string) ?? ''}
              onChange={(e) => setForm({ ...form, farmId: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="UUID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사고 경위</label>
            <textarea
              value={(form.description as string) ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm h-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">원인 분석</label>
            <textarea
              value={(form.cause as string) ?? ''}
              onChange={(e) => setForm({ ...form, cause: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm h-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">조치사항</label>
            <textarea
              value={(form.actionsTaken as string) ?? ''}
              onChange={(e) => setForm({ ...form, actionsTaken: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm h-16"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(form.isNearMiss as boolean) ?? false}
              onChange={(e) => setForm({ ...form, isNearMiss: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700">아차사고 (Near-miss)</label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">취소</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">저장</button>
        </div>
      </div>
    </div>
  );
}
