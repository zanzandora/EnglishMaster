import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from './App'

import './index.css'

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='*' element={<>404 Not Found</>} />
    </Routes>
  </BrowserRouter>
)
