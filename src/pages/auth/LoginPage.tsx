import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

function LoginPage() {
  const navigate = useNavigate()

  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const handleKakaoLogin = () => {
    window.location.href = `${apiBaseUrl}/api/auth/oauth/kakao/login`
  }

  const handleNaverLogin = () => {
    window.location.href = `${apiBaseUrl}/api/auth/oauth/naver/login`
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await login({ email, password })
      navigate('/datasets')
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      )
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card ui-card">
        <div className="auth-card-header">
          <span className="ui-badge ui-badge-primary">Welcome back</span>

          <h1>로그인</h1>

          <p>
            Dataset Classifier Tool에 다시 오신 것을 환영합니다.
            로그인 후 데이터셋 제작 작업을 이어갈 수 있습니다.
          </p>
        </div>

        {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="ui-form-group">
            <label className="ui-label" htmlFor="login-email">
              이메일 <span className="ui-required">*</span>
            </label>

            <input
              id="login-email"
              className="ui-input"
              type="email"
              placeholder="admin@dataset.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="ui-form-group">
            <label className="ui-label" htmlFor="login-password">
              비밀번호 <span className="ui-required">*</span>
            </label>

            <input
              id="login-password"
              className="ui-input"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="ui-button ui-button-primary ui-button-lg auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-divider">
          <span>또는 소셜 계정으로 계속하기</span>
        </div>

        <div className="auth-social-list">
          <button
            type="button"
            className="auth-social-button kakao"
            onClick={handleKakaoLogin}
          >
            카카오로 계속하기
          </button>

          <button
            type="button"
            className="auth-social-button naver"
            onClick={handleNaverLogin}
          >
            네이버로 계속하기
          </button>
        </div>

        <p className="auth-footer-text">
          아직 계정이 없나요? <Link to="/register">회원가입</Link>
        </p>
      </div>

      <aside className="auth-side-panel ui-card">
        <span className="ui-badge ui-badge-primary">AI Dataset Workflow</span>

        <h2>데이터 수집부터 학습 준비까지 한 번에</h2>

        <p>
          영상 업로드, 프레임 추출, 수동 라벨링, YOLO Export까지 연결되는
          개인 AI 데이터셋 제작 플랫폼입니다.
        </p>

        <div className="auth-flow-list">
          <div>
            <strong>01</strong>
            <span>Dataset 생성</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Video Upload</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Frame Labeling</span>
          </div>

          <div>
            <strong>04</strong>
            <span>YOLO Export</span>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default LoginPage