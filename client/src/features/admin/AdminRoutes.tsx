import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminDashboard />} />
      <Route path='*' element={<div>404 - Admin Not Found</div>} />
    </Routes>
  );
};

export default AdminRoutes;
