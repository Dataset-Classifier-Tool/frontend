import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore.ts'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute