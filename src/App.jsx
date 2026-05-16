import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetDetail from './pages/AssetDetail';
import approvalRoutes from './modules/approval/routes';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          {approvalRoutes}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
