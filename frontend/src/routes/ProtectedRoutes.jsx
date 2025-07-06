import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const token = localStorage.getItem('token')

  if (!token) {
    console.error("[ProtectedRoute] Token does not exist. Redirecting to /login")
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
