import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loadMe = useAuthStore((state) => state.loadMe)

  const [message, setMessage] = useState('소셜 로그인 처리 중입니다...')

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const error = searchParams.get('error')

    if (error) {
      setMessage(error)
      return
    }

    if (!accessToken || !refreshToken) {
      setMessage('로그인 토큰이 없습니다.')
      return
    }

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    loadMe()
      .then(() => {
        navigate('/datasets')
      })
      .catch(() => {
        setMessage('로그인 사용자 정보를 불러오지 못했습니다.')
      })
  }, [searchParams, loadMe, navigate])

  return (
    <section className="page-card">
      <h1>소셜 로그인</h1>
      <p>{message}</p>
    </section>
  )
}

export default OAuthCallbackPage