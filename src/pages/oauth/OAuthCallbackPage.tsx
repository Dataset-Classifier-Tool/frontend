import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState, Loading, Page, useToast } from '../../common/ui'
import { useAuthStore } from '../../stores/authStore'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const loadMe = useAuthStore((state) => state.loadMe)

  const [message, setMessage] = useState('소셜 로그인 처리 중입니다...')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const error = searchParams.get('error')

    if (error) {
      setIsError(true)
      setMessage(error)
      showToast(error, 'error')
      return
    }

    if (!accessToken || !refreshToken) {
      const errorMessage = '로그인 토큰이 없습니다.'

      setIsError(true)
      setMessage(errorMessage)
      showToast(errorMessage, 'error')
      return
    }

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    loadMe()
      .then(() => {
        showToast('소셜 로그인에 성공했습니다.', 'success')
        navigate('/datasets')
      })
      .catch(() => {
        const errorMessage = '로그인 사용자 정보를 불러오지 못했습니다.'

        setIsError(true)
        setMessage(errorMessage)
        showToast(errorMessage, 'error')
      })
  }, [searchParams, loadMe, navigate, showToast])

  return (
    <Page className="oauth-page">
      <section className="oauth-card ui-card">
        {isError ? (
          <EmptyState
            icon="⚠️"
            title="소셜 로그인 실패"
            description={message}
            action={
              <Link to="/login" className="ui-button ui-button-primary">
                로그인으로 돌아가기
              </Link>
            }
          />
        ) : (
          <Loading title="소셜 로그인 처리 중" description={message} />
        )}
      </section>
    </Page>
  )
}

export default OAuthCallbackPage