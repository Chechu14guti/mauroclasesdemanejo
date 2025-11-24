import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import CalendarView from './pages/CalendarView';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import Billing from './pages/Billing';
import Login from './pages/Login';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Route Guard Component
const RequireAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
  
    if (loading) {
      return <div className="flex h-screen items-center justify-center bg-slate-50 text-gray-500">Cargando...</div>;
    }
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <StoreProvider>
        <HashRouter>
            <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
                <RequireAuth>
                    <Layout />
                </RequireAuth>
            }>
                <Route index element={<CalendarView />} />
                <Route path="students" element={<StudentList />} />
                <Route path="students/:id" element={<StudentDetail />} />
                <Route path="billing" element={<Billing />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            </Routes>
        </HashRouter>
        </StoreProvider>
    </AuthProvider>
  );
};

export default App;