import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

function LoginPage() {
  const navigate = useNavigate()

  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await login({ email, password })
      navigate('/datasets')
    } catch {
      setErrorMessage('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    }
  }

  return (
    <section className="page-card">
      <h1>로그인</h1>
      <p>Dataset Classifier Tool에 다시 오신 것을 환영합니다.</p>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            placeholder="test@test.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="button primary full" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </section>
  )
}

export default LoginPage