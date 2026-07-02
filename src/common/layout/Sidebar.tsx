import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

type SidebarMenuItem = {
  path: string
  icon: string
  eyebrow: string
  title: string
  desc: string
  badge?: string
  end?: boolean
}

type SidebarMenuGroup = {
  title: string
  items: SidebarMenuItem[]
}

const MENUS: SidebarMenuGroup[] = [
  {
    title: '작업 공간',
    items: [
      {
        path: '/',
        icon: '🏠',
        eyebrow: 'HOME',
        title: '홈',
        desc: '플랫폼 소개와 시작점',
        end: true,
      },
      {
        path: '/dashboard',
        icon: '📊',
        eyebrow: 'DASHBOARD',
        title: '대시보드',
        desc: '데이터셋 제작 현황',
      },
    ],
  },
  {
    title: '데이터 제작',
    items: [
      {
        path: '/datasets',
        icon: '📁',
        eyebrow: 'DATASET',
        title: '데이터셋 관리',
        desc: '프레임 확인과 라벨링',
        badge: '핵심',
      },
      {
        path: '/upload',
        icon: '🎬',
        eyebrow: 'UPLOAD',
        title: '영상 업로드',
        desc: '영상 업로드와 프레임 추출',
      },
      {
        path: '/labeling',
        icon: '🏷️',
        eyebrow: 'LABELING',
        title: '라벨링 작업실',
        desc: '프레임 검수와 BBox 준비',
      },
    ],
  },
  {
    title: 'AI & Export',
    items: [
      {
        path: '/pricing',
        icon: '💎',
        eyebrow: 'PLAN',
        title: '회원 등급',
        desc: '사용량과 AI 기능 관리',
      },
    ],
  },
]

const MEMBERSHIP_LABEL: Record<string, string> = {
  free: 'Free Plan',
  premium: 'Premium Plan',
  admin: 'Admin',
}

function Sidebar() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const displayName = user?.nickname || user?.name || '사용자'
  const membership = user?.membership_type || 'free'
  const membershipLabel = MEMBERSHIP_LABEL[membership] ?? membership

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <NavLink to="/" className="sidebar-brand">
          <div className="sidebar-brand-mark">
            <span>DC</span>
          </div>

          <div className="sidebar-brand-text">
            <strong>Dataset Classifier</strong>
            <small>AI 학습 데이터셋 제작 플랫폼</small>
          </div>
        </NavLink>

        <div className="sidebar-status-card">
          <div>
            <span className="sidebar-status-label">현재 작업 단계</span>
            <strong>프론트 UI 마감</strong>
          </div>

          <span className="sidebar-status-chip">92%</span>
        </div>
      </div>

      <nav className="sidebar-content" aria-label="주요 메뉴">
        {MENUS.map((group) => (
          <section className="sidebar-group" key={group.title}>
            <div className="sidebar-group-title">
              <span>{group.title}</span>
            </div>

            <div className="sidebar-menu-list">
              {group.items.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-item active' : 'sidebar-item'
                  }
                >
                  <div className="sidebar-item-icon">{item.icon}</div>

                  <div className="sidebar-item-content">
                    <span>{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <small>{item.desc}</small>
                  </div>

                  {item.badge && (
                    <em className="sidebar-item-badge">{item.badge}</em>
                  )}
                </NavLink>
              ))}
            </div>
          </section>
        ))}

        {isAuthenticated && user?.membership_type === 'admin' && (
          <section className="sidebar-group">
            <div className="sidebar-group-title">
              <span>관리자</span>
            </div>

            <div className="sidebar-menu-list">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive ? 'sidebar-item active' : 'sidebar-item'
                }
              >
                <div className="sidebar-item-icon">🛡️</div>

                <div className="sidebar-item-content">
                  <span>ADMIN</span>
                  <strong>회원 관리</strong>
                  <small>사용자 등급 및 상태 관리</small>
                </div>

                <em className="sidebar-item-badge">관리</em>
              </NavLink>
            </div>
          </section>
        )}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            <div className="sidebar-user">
              <div className="sidebar-avatar">{displayName.slice(0, 1)}</div>

              <div className="sidebar-user-info">
                <strong>{displayName}</strong>
                <small>{membershipLabel}</small>
              </div>
            </div>

            <button
              className="sidebar-logout"
              type="button"
              onClick={handleLogout}
            >
              <span>↪</span>
              로그아웃
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar-login-card">
            <div className="sidebar-item-icon">🔐</div>

            <div className="sidebar-item-content">
              <span>LOGIN</span>
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