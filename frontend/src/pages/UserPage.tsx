import { UserPanel } from '@/features/system';

export default function UserPage() {
  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">사용자 관리</h1>
      </div>
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <UserPanel />
        </div>
      </div>
    </main>
  );
}
