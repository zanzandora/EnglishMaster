import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';

import ErrorPage from 'features/error/error';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import FAQ from '@components/dashboard/components/navBar/FAQ';
import AdminRoutes from './src/features/admin/AdminRoutes';
import Login from './src/features/admin/login/Login';
import Forgot from './src/features/admin/login/Forgot';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter>
    <Routes>
      <Route
        path='/admin/*'
        element={
          <DashboardLayout>
            <AdminRoutes />
          </DashboardLayout>
        }
      />
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

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);
