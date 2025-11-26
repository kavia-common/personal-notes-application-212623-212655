import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';
import { RequireAuth } from './context/AuthContext';

// PUBLIC_INTERFACE
export function AppRoutes() {
  /** Defines application routes and guards for protected pages. */
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/notes"
        element={
          <RequireAuth fallback={<Navigate to="/login" replace />}>
            <NotesPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/notes" replace />} />
    </Routes>
  );
}

export default AppRoutes;
