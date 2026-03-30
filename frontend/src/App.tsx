import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreatePlanPage from './pages/CreatePlanPage';
import PlansListPage from './pages/PlansListPage';
import PlanDetailPage from './pages/PlanDetailPage';
import AppLayout from './components/layout/AppLayout';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-surface-400 text-sm">Chargement de DAN...</span>
      </div>
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1E293B', color: '#F1F5F9', border: '1px solid #334155', borderRadius: '12px' },
            success: { iconTheme: { primary: '#10B981', secondary: '#F1F5F9' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#F1F5F9' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="create" element={<CreatePlanPage />} />
            <Route path="plans" element={<PlansListPage />} />
            <Route path="plans/:id" element={<PlanDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
