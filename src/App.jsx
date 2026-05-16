import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isConfigured, setIsConfigured] = useState(null);

  useEffect(() => {
    // Check if the backend is configured upon loading the app
    api.get('/setup/status')
      .then((res) => {
        setIsConfigured(res.data.isConfigured);
      })
      .catch((err) => {
        console.error('Failed to fetch setup status:', err);
        setIsConfigured(false);
      });
  }, []);

  if (isConfigured === null) {
    return <div>Loading application...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/setup" 
          element={!isConfigured ? <Setup onComplete={() => setIsConfigured(true)} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/login" 
          element={isConfigured ? <Login /> : <Navigate to="/setup" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isConfigured ? <Dashboard /> : <Navigate to="/setup" replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={isConfigured ? "/dashboard" : "/setup"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
