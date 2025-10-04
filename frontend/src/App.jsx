import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CsvPage from './pages/CsvPage';
import LandingPage from './pages/LandingPage';
import SplineLandingPage from './pages/SplineLandingPage';
import NavbarLanding from './components/NavbarLanding';
import AdminRoute from './components/AdminRoute';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/RegisterPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';
import { CsvDataProvider } from './context/CsvDataContext';

function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#F7F5ED] flex flex-col">
      <NavbarLanding />
      <div className="flex-1 w-full py-12 px-0">
        {children}
      </div>
    </div>
  );
}

function AuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth || !auth.token) {
      navigate('/login', { replace: true });
    } else if (auth.role === 'SUPER_ADMIN' || auth.role === 'COLLEGE_ADMIN') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [navigate]);
  return null;
}

function ProtectedRoute({ children, adminOnly }) {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (!auth || !auth.token) return <Navigate to="/login" replace />;
  if (adminOnly && auth.role !== 'SUPER_ADMIN' && auth.role !== 'COLLEGE_ADMIN') return <Navigate to="/home" replace />;
  return children;
}

function App() {
  return (
    <CsvDataProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/spline" element={<SplineLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<ProtectedRoute adminOnly={true}><AuthenticatedLayout><RegisterPage /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/home" element={<AuthenticatedLayout><LandingPage /></AuthenticatedLayout>} />
          <Route path="/upload" element={<AuthenticatedLayout><CsvPage /></AuthenticatedLayout>} />
          <Route path="/reports" element={<AuthenticatedLayout><ReportsPage /></AuthenticatedLayout>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AuthenticatedLayout><AdminPage /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/spline" replace />} />
          <Route path="*" element={<AuthRedirect />} />
        </Routes>
      </Router>
    </CsvDataProvider>
  );
}

export default App;
