import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Page } from '../../common/ui'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')
  const error = searchParams.get('error')

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token)

      const timer = window.setTimeout(() => {
        navigate('/dashboard')
      }, 1200)

      return () => window.clearTimeout(timer)
    }

    return undefined
  }, [navigate, token])

  const isSuccess = Boolean(token) && !error

  return (
    <Page className="oauth-page">
      <section className="oauth-card ui-card">
        <div className={`oauth-status-orb ${isSuccess ? 'is-success' : 'is-error'}`}>
          {isSuccess ? '✓' : '!'}
        </div>

        <span className="ui-badge ui-badge-primary">OAuth Callback</span>

        <h1>{isSuccess ? '소셜 로그인 처리 중입니다.' : '소셜 로그인에 실패했습니다.'}</h1>

        <p>
          {isSuccess
            ? '인증 토큰을 확인했습니다. 잠시 후 대시보드로 이동합니다.'
            : '인증 과정에서 문제가 발생했습니다. 다시 로그인하거나 일반 로그인을 사용해주세요.'}
        </p>

        <div className="oauth-actions">
          <Link to="/login" className="ui-button ui-button-secondary ui-button-lg">
            로그인 화면
          </Link>

          <Link to="/dashboard" className="ui-button ui-button-primary ui-button-lg">
            대시보드
          </Link>
        </div>
      </section>
    </Page>
  )
}

export default OAuthCallbackPage