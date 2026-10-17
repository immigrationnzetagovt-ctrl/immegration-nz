import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterStepOnePage from './pages/RegisterStepOnePage';
import RegisterStepTwoPage from './pages/RegisterStepTwoPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterStepOnePage />} />
            <Route path="/register/step-2" element={<RegisterStepTwoPage />} />

            {/* Protected Application Details */}
            <Route
              path="/application"
              element={
                <ProtectedRoute>
                  <ApplicationDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
