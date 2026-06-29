import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore.ts'

function Sidebar() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const isAdmin = user?.membership_type === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-inner">
        <NavLink to="/" className="app-sidebar-logo" title="대시보드">
          D
        </NavLink>

        <nav className="app-sidebar-nav" aria-label="메인 메뉴">
          <NavLink to="/" className="app-sidebar-link" title="대시보드">
            🏠
          </NavLink>

          <NavLink to="/datasets" className="app-sidebar-link" title="데이터셋">
            🗂️
          </NavLink>

          <NavLink to="/upload" className="app-sidebar-link" title="영상 업로드">
            ⬆️
          </NavLink>

          <NavLink to="/pricing" className="app-sidebar-link" title="회원 등급">
            💎
          </NavLink>

          {isAuthenticated && isAdmin && (
            <NavLink to="/admin/users" className="app-sidebar-link" title="회원 관리">
              🛡️
            </NavLink>
          )}
        </nav>

        <div className="app-sidebar-bottom">
          {isAuthenticated ? (
            <button
              type="button"
              className="app-sidebar-link"
              title="로그아웃"
              onClick={handleLogout}
            >
              🚪
            </button>
          ) : (
            <NavLink to="/login" className="app-sidebar-link" title="로그인">
              🔐
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar