import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

function RegisterPage() {
  const navigate = useNavigate()

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

      navigate('/login')
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          '회원가입에 실패했습니다. 입력값을 확인해주세요.',
      )
    }
  }

  return (
    <section className="page-card">
      <h1>회원가입</h1>
      <p>이름, 생년월일, 이메일을 입력해 계정을 생성합니다.</p>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          이름
          <input
            type="text"
            placeholder="김도균"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label>
          생년월일
          <input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
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
          이메일
          <input
            type="email"
            placeholder="test@test.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
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
            autoComplete="new-password"
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