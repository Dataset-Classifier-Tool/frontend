import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../common/ui'

function RegisterPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await register({
        name,
        birth_date: birthDate,
        nickname,
        email,
        password,
      })

      showToast('회원가입이 완료되었습니다. 로그인해주세요.', 'success')
      navigate('/login')
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        '회원가입에 실패했습니다. 입력값을 확인해주세요.'

      setErrorMessage(message)
      showToast(message, 'error')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-brand-panel ui-card">
        <span className="ui-badge ui-badge-primary">Start building</span>

        <div className="auth-brand-content">
          <h1>
            나만의 AI 학습
            <br />
            데이터셋을 만드세요.
          </h1>

          <p>
            처음에는 수동 라벨링으로 시작하고, 이후 Bounding Box와 자동 라벨링을
            연결해 더 강력한 데이터셋 제작 흐름으로 확장할 수 있습니다.
          </p>
        </div>

        <div className="auth-flow-list">
          <div>
            <strong>Fire</strong>
            <span>화재 데이터</span>
          </div>

          <div>
            <strong>Smoke</strong>
            <span>연기 데이터</span>
          </div>

          <div>
            <strong>Light</strong>
            <span>차량 등화류</span>
          </div>

          <div>
            <strong>Negative</strong>
            <span>오탐 억제 데이터</span>
          </div>
        </div>
      </div>

      <div className="auth-card ui-card">
        <div className="auth-card-header">
          <span className="ui-badge ui-badge-primary">Create account</span>

          <h2>회원가입</h2>

          <p>계정을 생성하고 영상 기반 AI 학습 데이터셋 제작을 시작합니다.</p>
        </div>

        {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="ui-form-row">
            <div className="ui-form-group">
              <label className="ui-label" htmlFor="register-name">
                이름 <span className="ui-required">*</span>
              </label>

              <input
                id="register-name"
                className="ui-input"
                type="text"
                placeholder="김도균"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="ui-form-group">
              <label className="ui-label" htmlFor="register-nickname">
                닉네임 <span className="ui-required">*</span>
              </label>

              <input
                id="register-nickname"
                className="ui-input"
                type="text"
                placeholder="도균"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="ui-form-group">
            <label className="ui-label" htmlFor="register-birth-date">
              생년월일 <span className="ui-required">*</span>
            </label>

            <input
              id="register-birth-date"
              className="ui-input"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              required
            />
          </div>

          <div className="ui-form-group">
            <label className="ui-label" htmlFor="register-email">
              이메일 <span className="ui-required">*</span>
            </label>

            <input
              id="register-email"
              className="ui-input"
              type="email"
              placeholder="test@test.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="ui-form-group">
            <label className="ui-label" htmlFor="register-password">
              비밀번호 <span className="ui-required">*</span>
            </label>

            <input
              id="register-password"
              className="ui-input"
              type="password"
              placeholder="8자 이상"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="ui-button ui-button-primary ui-button-lg auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-footer-text">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage