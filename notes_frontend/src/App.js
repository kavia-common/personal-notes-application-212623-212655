import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';

// PUBLIC_INTERFACE
export default function App() {
  /** Root application component setting up providers and router. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
