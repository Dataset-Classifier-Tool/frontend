import { Link, NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

function Header() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const logout = useAuthStore((state) => state.logout)

  const isLoggedIn = Boolean(accessToken)
  const isAdmin = user?.membership_type === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <Link to="/" className="logo" aria-label="홈으로 이동">
        <strong>데이터셋 분류 도구</strong>
        <span>AI 학습 데이터 제작 플랫폼</span>
      </Link>

      <nav className="nav header-main-nav" aria-label="주요 메뉴">
        <NavLink to="/datasets">데이터셋</NavLink>
        <NavLink to="/upload">영상 업로드</NavLink>
        <NavLink to="/pricing">요금제</NavLink>

        {isLoggedIn && isAdmin && <NavLink to="/admin/users">관리자</NavLink>}
      </nav>

      <div className="nav header-auth-nav">
        {isLoggedIn ? (
          <>
            <span className="header-user-chip">
              <strong>{user?.name || user?.email || '사용자'}</strong>
              <small>{isAdmin ? '관리자' : user?.membership_type || '회원'}</small>
            </span>

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
    </header>
  )
}

export default Header