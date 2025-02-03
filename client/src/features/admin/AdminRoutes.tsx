import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import StudentListPage from './pages/list/students';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminDashboard />} />
      <Route path='/list/students' element={<StudentListPage />} />
      <Route path='*' element={<div>404 - Admin Not Found</div>} />
    </Routes>
  );
};

export default AdminRoutes;
