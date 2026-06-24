import { useState } from 'react'
import type { FormEvent } from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../stores/authStore'

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
            await login({email, password})
            navigate('/datasets')
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message ||
                '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
            )
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
                        placeholder="admin@dataset.com"
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
                        placeholder="비밀번호"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </label>

                <button type="submit" className="button primary full" disabled={isLoading}>
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>

            <div className="social-login-box">
                <button
                    type="button"
                    className="button kakao full"
                    onClick={handleKakaoLogin}
                >
                    카카오로 계속하기
                </button>

                <button
                    type="button"
                    className="button naver full"
                    onClick={handleNaverLogin}
                >
                    네이버로 계속하기
                </button>
            </div>
        </section>
    )
}

export default LoginPage