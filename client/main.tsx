import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import './src/i18n';
import 'react-toastify/dist/ReactToastify.css';

import ErrorPage from 'features/error/error';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import FAQ from '@components/dashboard/components/navBar/FAQ';
import AdminRoutes from './src/features/admin/AdminRoutes';
import TeacherRoutes from './src/features/teacher/TeacherRoutes';
import Login from './src/features/admin/login/Login';
import Forgot from './src/features/admin/login/Forgot';
import SendOPT from './src/features/admin/login/SendOPT';
import ResetPassword from './src/features/admin/login/ResetPassword';
import ProtectedRoute from 'ProtectedRoute';
import { AuthProvider } from 'context/AuthProvider';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/forgot' element={<Forgot />} />
        <Route path='/send-otp' element={<SendOPT />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Dashboard */}
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
      <ToastContainer newestOnTop={true} closeOnClick={true} autoClose={3000} />
    </BrowserRouter>
  </AuthProvider>
);
