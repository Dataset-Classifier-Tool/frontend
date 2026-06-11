import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

function RegisterPage() {
  const navigate = useNavigate()

  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await register({ email, nickname, password })
      navigate('/login')
    } catch {
      setErrorMessage('회원가입에 실패했습니다. 입력값을 확인해주세요.')
    }
  }

  return (
    <section className="page-card">
      <h1>회원가입</h1>
      <p>무료 계정으로 하루 10회 데이터셋 분류 기능을 사용할 수 있습니다.</p>

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
          닉네임
          <input
            type="text"
            placeholder="도균"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            placeholder="8자 이상"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>

        <button type="submit" className="button primary full" disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </section>
  )
}

export default RegisterPage