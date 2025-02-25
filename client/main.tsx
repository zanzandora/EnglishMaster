import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import './src/i18n';

import ErrorPage from 'features/error/error';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import FAQ from '@components/dashboard/components/navBar/FAQ';
import AdminRoutes from './src/features/admin/AdminRoutes';
import TeacherRoutes from './src/features/teacher/TeacherRoutes';
import Login from './src/features/admin/login/Login';
import Forgot from './src/features/admin/login/Forgot';
import ProtectedRoute from 'ProtectedRoute';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/forgot' element={<Forgot />} />
      <Route
        path='/faq'
        element={
          <DashboardLayout>
            <FAQ />
          </DashboardLayout>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path='/admin/*'
          element={
            <DashboardLayout>
              <AdminRoutes />
            </DashboardLayout>
          }
        />
        <Route
          path='/teacher/*'
          element={
            <DashboardLayout>
              <TeacherRoutes />
            </DashboardLayout>
          }
        />
        <Route
          path='/faq'
          element={
            <DashboardLayout>
              <FAQ />
            </DashboardLayout>
          }
        />
      </Route>

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);
