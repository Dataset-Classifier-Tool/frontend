import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

function Header() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const logout = useAuthStore((state) => state.logout)

  const isLoggedIn = Boolean(accessToken)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <strong>데이터셋 분류 도구</strong>
        <span>AI 학습 데이터 제작 플랫폼</span>
      </Link>

      <nav className="nav">
        <Link to="/datasets">데이터셋</Link>
        <Link to="/upload">영상 업로드</Link>
        <Link to="/pricing">요금제</Link>

        {isLoggedIn && <Link to="/admin/users">관리자</Link>}
      </nav>

      <div className="nav">
        {isLoggedIn ? (
          <>
            <span className="header-user-name">
              {user?.name || user?.email || '사용자'}
            </span>

            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/register">회원가입</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header