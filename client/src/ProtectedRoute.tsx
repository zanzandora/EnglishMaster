import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const navigate = useNavigate()

  useEffect(() => {
    const hasToken = document.cookie.includes('token=')
    if (!hasToken) navigate('/login')
  }, [navigate])

  return <Outlet />
}
