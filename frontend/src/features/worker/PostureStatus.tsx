import { useEffect, useState } from 'react';
import { workerService, type PostureStatus as PostureData } from '@/services/workerService';

const POSTURE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  normal: { icon: '🧍', label: '정상 자세', color: 'text-green-700 bg-green-50' },
  risky: { icon: '⚠️', label: '위험 자세', color: 'text-orange-700 bg-orange-50' },
  fallen: { icon: '🚨', label: '쓰러짐 감지', color: 'text-red-700 bg-red-50' },
};

interface Props {
  workerId: string;
}

export default function PostureStatusPanel({ workerId }: Props) {
  const [posture, setPosture] = useState<PostureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosture = async () => {
      setLoading(true);
      try {
        const data = await workerService.getPosture(workerId);
        setPosture(data);
      } catch (err) {
        console.error('자세 상태 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosture();
  }, [workerId]);

  if (loading || !posture) {
    return (
      <div className="bg-white rounded-lg border p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">자세/동작 상태</h3>
        <div className="flex items-center justify-center h-32 text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const config = POSTURE_CONFIG[posture.posture] ?? POSTURE_CONFIG.normal;

  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">자세/동작 상태</h3>

      <div className={`rounded-lg p-6 text-center ${config.color} ${posture.posture === 'fallen' ? 'animate-pulse' : ''}`}>
        <div className="text-4xl mb-2">{config.icon}</div>
        <p className="text-lg font-bold">{config.label}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Roll</p>
          <p className="text-lg font-bold text-gray-900">{posture.roll}&deg;</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Pitch</p>
          <p className="text-lg font-bold text-gray-900">{posture.pitch}&deg;</p>
        </div>
      </div>
    </div>
  );
}
