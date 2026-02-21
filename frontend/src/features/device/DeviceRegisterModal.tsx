import { useState, useEffect } from 'react';

type DeviceTab = 'vest' | 'kit' | 'sensor';

interface Props {
  tab: DeviceTab;
  editData?: Record<string, unknown> | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function DeviceRegisterModal({ tab, editData, open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      const initial: Record<string, string> = {};
      Object.entries(editData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          initial[key] = String(value);
        }
      });
      setForm(initial);
    } else {
      setForm({});
    }
    setErrors({});
  }, [editData, open]);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.serialNo?.trim()) newErrors.serialNo = '시리얼 번호를 입력하세요.';

    if (tab === 'vest') {
      if (!form.moduleType) newErrors.moduleType = '모듈 타입을 선택하세요.';
      if (!form.farmId?.trim()) newErrors.farmId = '농가 ID를 입력하세요.';
    } else if (tab === 'kit') {
      if (!form.type) newErrors.type = '키트 타입을 선택하세요.';
      if (!form.farmId?.trim()) newErrors.farmId = '농가 ID를 입력하세요.';
    } else {
      if (!form.type) newErrors.type = '센서 타입을 선택하세요.';
      if (!form.workplaceId?.trim()) newErrors.workplaceId = '작업장 ID를 입력하세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data: Record<string, unknown> = { ...form };
    // 숫자 필드 변환
    if (data.lat) data.lat = parseFloat(data.lat as string);
    if (data.lng) data.lng = parseFloat(data.lng as string);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? '디바이스 수정' : '디바이스 등록'} -{' '}
            {tab === 'vest' ? '스마트 조끼' : tab === 'kit' ? '응급키트' : '환경센서'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            &times;
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* 공통: 시리얼 번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시리얼 번호 *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.serialNo || ''}
              onChange={(e) => handleChange('serialNo', e.target.value)}
            />
            {errors.serialNo && <p className="text-red-500 text-xs mt-1">{errors.serialNo}</p>}
          </div>

          {/* 탭별 필드 */}
          {tab === 'vest' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">모듈 타입 *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.moduleType || ''}
                  onChange={(e) => handleChange('moduleType', e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="open_field">노지</option>
                  <option value="livestock">축산</option>
                  <option value="orchard">과수원</option>
                </select>
                {errors.moduleType && <p className="text-red-500 text-xs mt-1">{errors.moduleType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">농가 ID *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.farmId || ''}
                  onChange={(e) => handleChange('farmId', e.target.value)}
                />
                {errors.farmId && <p className="text-red-500 text-xs mt-1">{errors.farmId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">통신 방식</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.commType || ''}
                  onChange={(e) => handleChange('commType', e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="ble">BLE</option>
                  <option value="lora">LoRa</option>
                  <option value="lte">LTE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">펌웨어 버전</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.firmwareVer || ''}
                  onChange={(e) => handleChange('firmwareVer', e.target.value)}
                />
              </div>
            </>
          )}

          {tab === 'kit' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">키트 타입 *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.type || ''}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="wall_mounted">벽부착형</option>
                  <option value="vehicle_mounted">차량탑재형</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">농가 ID *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.farmId || ''}
                  onChange={(e) => handleChange('farmId', e.target.value)}
                />
                {errors.farmId && <p className="text-red-500 text-xs mt-1">{errors.farmId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">작업장 ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.workplaceId || ''}
                  onChange={(e) => handleChange('workplaceId', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">차량 식별자</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.vehicleId || ''}
                  onChange={(e) => handleChange('vehicleId', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위도</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={form.lat || ''}
                    onChange={(e) => handleChange('lat', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경도</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={form.lng || ''}
                    onChange={(e) => handleChange('lng', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'sensor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">센서 타입 *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.type || ''}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="temperature">온도</option>
                  <option value="humidity">습도</option>
                  <option value="gas_o2">산소(O2)</option>
                  <option value="gas_h2s">황화수소(H2S)</option>
                  <option value="gas_nh3">암모니아(NH3)</option>
                  <option value="gas_ch4">메탄(CH4)</option>
                  <option value="current">전류</option>
                  <option value="voltage">전압</option>
                  <option value="wbgt">WBGT</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">작업장 ID *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={form.workplaceId || ''}
                  onChange={(e) => handleChange('workplaceId', e.target.value)}
                />
                {errors.workplaceId && <p className="text-red-500 text-xs mt-1">{errors.workplaceId}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위도</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={form.lat || ''}
                    onChange={(e) => handleChange('lat', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경도</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={form.lng || ''}
                    onChange={(e) => handleChange('lng', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEdit ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
