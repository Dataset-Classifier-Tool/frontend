import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

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
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">AI</div>
        <div>
          <strong>데이터셋 플랫폼</strong>
          <span>AI 학습 데이터 운영 도구</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">메인</div>
        <NavLink to="/">대시보드</NavLink>
        <NavLink to="/datasets">데이터셋</NavLink>
        <NavLink to="/upload">영상 업로드</NavLink>

        <div className="sidebar-section-label">AI 워크플로우</div>
        <NavLink to="/datasets">라벨링 작업</NavLink>
        <NavLink to="/datasets">자동 라벨링</NavLink>
        <NavLink to="/pricing">회원 등급</NavLink>

        {isAuthenticated && isAdmin && (
          <>
            <div className="sidebar-section-label">관리자</div>
            <NavLink to="/admin/users">회원 관리</NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-user">
        {isAuthenticated ? (
          <>
            <strong>{user?.name || '사용자'}</strong>
            <span>{user?.email}</span>
            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">로그인</NavLink>
            <NavLink to="/register">회원가입</NavLink>
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar