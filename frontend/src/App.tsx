import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import DevicePage from '@/pages/DevicePage';
import AlertPage from '@/pages/AlertPage';
import WorkerDetailPage from '@/pages/WorkerDetailPage';
import AIPage from '@/pages/AIPage';
import ReportPage from '@/pages/ReportPage';
import EducationPage from '@/pages/EducationPage';
import SystemPage from '@/pages/SystemPage';
import UserPage from '@/pages/UserPage';
import FarmPage from '@/pages/FarmPage';
import AppLayout from '@/components/AppLayout';
import { useAuthStore } from '@/stores/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/devices" element={<DevicePage />} />
          <Route path="/alerts" element={<AlertPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/farms" element={<FarmPage />} />
          <Route path="/workers/:id" element={<WorkerDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
