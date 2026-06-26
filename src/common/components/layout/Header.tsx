import { Link, useLocation } from 'react-router-dom'

import { useAuthStore } from '../../../stores/authStore'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: '대시보드',
    subtitle: 'AI 학습 데이터셋 제작 현황을 한눈에 확인합니다.',
  },
  '/datasets': {
    title: '데이터셋',
    subtitle: '영상에서 추출한 프레임과 라벨링 상태를 관리합니다.',
  },
  '/upload': {
    title: '영상 업로드',
    subtitle: '원본 영상을 업로드하고 학습용 프레임을 추출합니다.',
  },
  '/pricing': {
    title: '회원 등급',
    subtitle: '사용량 제한과 자동 라벨링 기능을 관리합니다.',
  },
  '/admin/users': {
    title: '회원 관리',
    subtitle: '관리자 권한으로 사용자 상태와 등급을 관리합니다.',
  },
  '/login': {
    title: '로그인',
    subtitle: 'Dataset Classifier Tool에 접속합니다.',
  },
  '/register': {
    title: '회원가입',
    subtitle: '새 계정을 생성하고 데이터셋 제작을 시작합니다.',
  },
}

function getPageMeta(pathname: string) {
  if (pathname.startsWith('/datasets/')) {
    return {
      title: '데이터셋 상세',
      subtitle: '프레임 라벨링, Bounding Box, Export 작업을 진행합니다.',
    }
  }

  return PAGE_TITLES[pathname] ?? {
    title: 'Dataset Classifier Tool',
    subtitle: 'AI 학습 데이터 제작 플랫폼',
  }
}

function Header() {
  const location = useLocation()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const pageMeta = getPageMeta(location.pathname)

  return (
    <header className="app-header">
      <div className="app-header-left">
        <div>
          <h1 className="app-header-title">{pageMeta.title}</h1>
          <p className="app-header-subtitle">{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className="app-header-right">
        {isAuthenticated ? (
          <div className="app-user-chip">
            <div className="app-user-avatar">
              {(user?.nickname || user?.name || 'U').slice(0, 1)}
            </div>

            <div>
              <div className="app-user-name">{user?.nickname || user?.name || '사용자'}</div>
              <div className="app-user-role">{user?.membership_type || 'free'}</div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="ui-button ui-button-secondary ui-button-sm">
              로그인
            </Link>

            <Link to="/register" className="ui-button ui-button-primary ui-button-sm">
              시작하기
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header