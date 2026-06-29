import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { Loading } from '../../common/ui'
import { useAuthStore } from '../../stores/authStore'

type ProtectedRouteProps = {
  children: ReactNode
  requireAdmin?: boolean
}

function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loadMe = useAuthStore((state) => state.loadMe)

  const [isChecking, setIsChecking] = useState(Boolean(accessToken && !user))

  useEffect(() => {
    if (!accessToken || user) {
      setIsChecking(false)
      return
    }

    loadMe().finally(() => {
      setIsChecking(false)
    })
  }, [accessToken, user, loadMe])

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isChecking) {
    return (
      <Loading
        title="권한을 확인하는 중입니다"
        description="로그인 정보를 확인하고 있습니다."
      />
    )
  }

  if (requireAdmin && user?.membership_type !== 'admin') {
    return <Navigate to="/datasets" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute