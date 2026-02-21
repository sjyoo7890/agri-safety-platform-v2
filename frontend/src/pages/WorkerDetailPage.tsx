import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workerService, type WorkerStatus } from '@/services/workerService';
import {
  WorkerProfileCard,
  VitalsChart,
  PostureStatusPanel,
  WorkTimeline,
  AcclimatizationPanel,
} from '@/features/worker';

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<WorkerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchStatus = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await workerService.getStatus(id);
        setStatus(data);
      } catch (err) {
        console.error('작업자 상태 로드 실패:', err);
        setError('작업자 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [id]);

  if (!id) {
    return (
      <main className="flex-1 flex items-center justify-center text-gray-400">
        작업자 ID가 없습니다.
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:text-blue-800">
          &larr; 대시보드
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          작업자 상세 모니터링{status ? ` - ${status.worker.name}` : ''}
        </h1>
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-96 text-gray-400">
            작업자 데이터를 불러오는 중...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96 text-red-500">{error}</div>
        ) : status ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <WorkerProfileCard status={status} />
              </div>
              <div className="lg:col-span-2">
                <VitalsChart workerId={id} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <PostureStatusPanel workerId={id} />
              </div>
              <div className="lg:col-span-2">
                <WorkTimeline workerId={id} />
              </div>
            </div>
            <AcclimatizationPanel workerId={id} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
