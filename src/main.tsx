import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'

import App from './App'
import Admin from './admin/Admin'
import Login from './admin/login/Login'

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />

      <Route path='/admin' element={<Admin />} />
      <Route path='/login' element={<Login />} />

      <Route path='*' element={<>404 Not Found</>} />
    </Routes>
  </BrowserRouter>
)
