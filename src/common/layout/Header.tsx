import { Link, useLocation } from 'react-router-dom'

import { NotificationCenter } from '../ui'
import { useAuthStore } from '../../stores/authStore'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: '홈',
    subtitle: 'AI 학습 데이터셋 제작 플랫폼을 시작합니다.',
  },
  '/dashboard': {
    title: '대시보드',
    subtitle: '데이터셋 제작 현황과 다음 작업을 확인합니다.',
  },
  '/datasets': {
    title: '데이터셋',
    subtitle: '영상에서 추출한 프레임과 라벨링 상태를 관리합니다.',
  },
  '/upload': {
    title: '영상 업로드',
    subtitle: '원천 영상을 업로드하고 학습용 프레임을 추출합니다.',
  },
  '/labeling': {
    title: '라벨링 작업실',
    subtitle: '프레임 검수와 Bounding Box 작업으로 확장되는 공간입니다.',
  },
  '/pricing': {
    title: '회원 등급',
    subtitle: '사용량 제한과 AI 기능 접근 권한을 관리합니다.',
  },
  '/admin/users': {
    title: '회원 관리',
    subtitle: '관리자 권한으로 사용자 등급과 상태를 관리합니다.',
  },
  '/login': {
    title: '로그인',
    subtitle: '작업 공간으로 다시 접속합니다.',
  },
  '/register': {
    title: '회원가입',
    subtitle: '계정을 만들고 데이터셋 제작을 시작합니다.',
  },
  '/oauth/callback': {
    title: '소셜 로그인',
    subtitle: '소셜 계정 인증 결과를 처리합니다.',
  },
}

function getPageMeta(pathname: string) {
  if (pathname.startsWith('/datasets/')) {
    return {
      title: '데이터셋 상세',
      subtitle: '프레임 라벨링, Export, Bounding Box 준비 작업을 진행합니다.',
    }
  }

  return PAGE_TITLES[pathname] ?? {
    title: 'Dataset Classifier Tool',
    subtitle: 'AI 학습 데이터셋 제작 플랫폼',
  }
}

const MEMBERSHIP_LABEL: Record<string, string> = {
  free: 'Free',
  premium: 'Premium',
  admin: 'Admin',
}

function Header() {
  const location = useLocation()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const pageMeta = getPageMeta(location.pathname)
  const displayName = user?.nickname || user?.name || '사용자'
  const membership = user?.membership_type || 'free'
  const membershipLabel = MEMBERSHIP_LABEL[membership] ?? membership

  return (
    <header className="app-header">
      <div className="app-header-left">
        <div className="app-header-title-block">
          <span className="app-header-eyebrow">Dataset Classifier Tool</span>
          <h1 className="app-header-title">{pageMeta.title}</h1>
          <p className="app-header-subtitle">{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className="app-header-right">
        {isAuthenticated ? (
          <>
            <NotificationCenter />

            <Link to="/dashboard" className="ui-button ui-button-secondary ui-button-sm">
              대시보드
            </Link>

            <div className="app-user-chip">
              <div className="app-user-avatar">{displayName.slice(0, 1)}</div>

              <div>
                <div className="app-user-name">{displayName}</div>
                <div className="app-user-role">{membershipLabel}</div>
              </div>
            </div>
          </>
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