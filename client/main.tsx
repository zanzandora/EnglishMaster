import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'

import Admin from './src/features/admin/Admin'
import Login from './src/features/admin/login/Login'
import Forgot from './src/features/admin/login/Forgot'

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter>
    <Routes>
      <Route path='/admin' element={<Admin />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot' element={<Forgot />} />

      <Route path='*' element={<>404 Not Found</>} />
    </Routes>
  </BrowserRouter>
)
