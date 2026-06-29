import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

const MENUS = [
  {
    title: '작업 공간',
    items: [
      {
        path: '/',
        icon: '🏠',
        title: '대시보드',
        desc: '전체 현황 확인',
      },
      {
        path: '/datasets',
        icon: '📁',
        title: '데이터셋 관리',
        desc: '프로젝트 생성 및 라벨링',
      },
      {
        path: '/upload',
        icon: '🎬',
        title: '영상 업로드',
        desc: '프레임 추출 시작',
      },
    ],
  },
  {
    title: 'AI & Export',
    items: [
      {
        path: '/pricing',
        icon: '💎',
        title: '요금제',
        desc: '사용량 및 AI 기능',
      },
    ],
  },
]

function Sidebar() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const displayName = user?.nickname || user?.name || 'User'
  const membership = user?.membership_type || 'free'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AI</div>

          <div>
            <h2>Dataset Classifier</h2>
            <p>AI Dataset Platform</p>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        {MENUS.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <span className="sidebar-group-title">{group.title}</span>

            {group.items.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                className={({ isActive }) =>
                  isActive ? 'sidebar-item active' : 'sidebar-item'
                }
              >
                <div className="sidebar-item-icon">{item.icon}</div>

                <div>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </div>
              </NavLink>
            ))}
          </div>
        ))}

        {isAuthenticated && user?.membership_type === 'admin' && (
          <div className="sidebar-group">
            <span className="sidebar-group-title">관리자</span>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? 'sidebar-item active' : 'sidebar-item'
              }
            >
              <div className="sidebar-item-icon">🛡️</div>

              <div>
                <strong>회원 관리</strong>
                <small>사용자 권한 및 상태</small>
              </div>
            </NavLink>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            <div className="sidebar-user">
              <div className="sidebar-avatar">{displayName.slice(0, 1)}</div>

              <div>
                <strong>{displayName}</strong>
                <small>{membership}</small>
              </div>
            </div>

            <button
              className="sidebar-logout"
              type="button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar-item">
            <div className="sidebar-item-icon">🔐</div>

            <div>
              <strong>로그인</strong>
              <small>계정으로 접속하기</small>
            </div>
          </NavLink>
        )}
      </div>
    </aside>
  )
}

export default Sidebar