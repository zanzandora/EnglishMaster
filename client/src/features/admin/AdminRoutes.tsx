import { Routes, Route } from 'react-router-dom';
import ErrorPage from 'features/error/error';
import AdminDashboard from './pages/AdminDashboard';
import StudentListPage from './pages/list/students';
import TeacherListPage from './pages/list/teachers';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminDashboard />} />
      <Route path='/list/students' element={<StudentListPage />} />
      <Route path='/list/teachers' element={<TeacherListPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default AdminRoutes;
