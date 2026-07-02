import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Page, useToast } from '../../common/ui'
import { useAuthStore } from '../../stores/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.')
      showToast('이메일과 비밀번호를 입력해주세요.', 'warning')
      return
    }

    try {
      setErrorMessage('')

      await login({
        email: email.trim(),
        password,
      })

      showToast('로그인되었습니다.', 'success')
      navigate('/dashboard')
    } catch {
      setErrorMessage('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      showToast('로그인에 실패했습니다.', 'error')
    }
  }

  return (
    <Page className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual ui-card">
          <span className="ui-badge ui-badge-primary">Dataset Classifier</span>

          <h1>
            다시 돌아와서
            <br />
            데이터셋 제작을 이어가세요.
          </h1>

          <p>
            영상 업로드, 프레임 추출, 수동 라벨링, Export까지 이어지는
            AI 학습 데이터셋 제작 흐름을 계속 진행할 수 있습니다.
          </p>

          <div className="auth-visual-grid">
            <div>
              <strong>01</strong>
              <span>Dataset</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Upload</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Labeling</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Export</span>
            </div>
          </div>
        </div>

        <div className="auth-card ui-card">
          <div className="auth-card-head">
            <span className="ui-badge ui-badge-primary">Login</span>
            <h2>로그인</h2>
            <p>계정으로 접속하고 작업 공간으로 이동합니다.</p>
          </div>

          {errorMessage && <div className="auth-alert">{errorMessage}</div>}

          <form className="ui-form" onSubmit={handleSubmit}>
            <div className="ui-form-group">
              <label className="ui-label" htmlFor="email">
                이메일
              </label>

              <input
                id="email"
                className="ui-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="ui-form-group">
              <label className="ui-label" htmlFor="password">
                비밀번호
              </label>

              <input
                id="password"
                className="ui-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="ui-button ui-button-primary ui-button-lg auth-submit"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="auth-divider">
            <span>또는</span>
          </div>

          <div className="auth-social-grid">
            <button type="button" className="ui-button ui-button-secondary" disabled>
              Google 준비 중
            </button>

            <button type="button" className="ui-button ui-button-secondary" disabled>
              Kakao 준비 중
            </button>
          </div>

          <p className="auth-switch">
            아직 계정이 없나요?
            <Link to="/register"> 회원가입</Link>
          </p>
        </div>
      </section>
    </Page>
  )
}

export default LoginPage