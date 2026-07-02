import {useState} from 'react'
import type {FormEvent} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {Page, useToast} from '../../common/ui'
import {registerApi} from '../../features/auth/api/authApi'

function RegisterPage() {
    const navigate = useNavigate()
    const {showToast} = useToast()

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!email.trim() || !name.trim() || !password.trim()) {
            setErrorMessage('필수 정보를 입력해주세요.')
            showToast('필수 정보를 입력해주세요.', 'warning')
            return
        }

        if (password !== passwordConfirm) {
            setErrorMessage('비밀번호가 일치하지 않습니다.')
            showToast('비밀번호가 일치하지 않습니다.', 'warning')
            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage('')

            await registerApi({
                email: email.trim(),
                name: name.trim(),
                nickname: nickname.trim() || name.trim(),
                password,
                birth_date: '',
            })

            showToast('회원가입이 완료되었습니다. 로그인해주세요.', 'success')
            navigate('/login')
        } catch {
            setErrorMessage('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.')
            showToast('회원가입에 실패했습니다.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Page className="auth-page">
            <section className="auth-shell">
                <div className="auth-visual ui-card">
                    <span className="ui-badge ui-badge-primary">Start Dataset Builder</span>

                    <h1>
                        첫 데이터셋을 만들고
                        <br/>
                        AI 학습 준비를 시작하세요.
                    </h1>

                    <p>
                        회원가입 후 데이터셋 생성, 영상 업로드, 프레임 라벨링, Export 흐름을
                        바로 사용할 수 있습니다.
                    </p>

                    <div className="auth-visual-grid">
                        <div>
                            <strong>Fire</strong>
                            <span>화재</span>
                        </div>

                        <div>
                            <strong>Smoke</strong>
                            <span>연기</span>
                        </div>

                        <div>
                            <strong>Light</strong>
                            <span>등화류</span>
                        </div>

                        <div>
                            <strong>Clean</strong>
                            <span>일반</span>
                        </div>
                    </div>
                </div>

                <div className="auth-card ui-card">
                    <div className="auth-card-head">
                        <span className="ui-badge ui-badge-primary">Register</span>
                        <h2>회원가입</h2>
                        <p>계정을 만들고 데이터셋 제작 작업을 시작합니다.</p>
                    </div>

                    {errorMessage && <div className="auth-alert">{errorMessage}</div>}

                    <form className="ui-form" onSubmit={handleSubmit}>
                        <div className="ui-form-group">
                            <label className="ui-label" htmlFor="email">
                                이메일 <span className="ui-required">*</span>
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
                            <label className="ui-label" htmlFor="name">
                                이름 <span className="ui-required">*</span>
                            </label>

                            <input
                                id="name"
                                className="ui-input"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="이름을 입력하세요"
                                autoComplete="name"
                            />
                        </div>

                        <div className="ui-form-group">
                            <label className="ui-label" htmlFor="nickname">
                                닉네임
                            </label>

                            <input
                                id="nickname"
                                className="ui-input"
                                value={nickname}
                                onChange={(event) => setNickname(event.target.value)}
                                placeholder="표시 이름"
                            />
                        </div>

                        <div className="ui-form-group">
                            <label className="ui-label" htmlFor="password">
                                비밀번호 <span className="ui-required">*</span>
                            </label>

                            <input
                                id="password"
                                className="ui-input"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="ui-form-group">
                            <label className="ui-label" htmlFor="password-confirm">
                                비밀번호 확인 <span className="ui-required">*</span>
                            </label>

                            <input
                                id="password-confirm"
                                className="ui-input"
                                type="password"
                                value={passwordConfirm}
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                                placeholder="비밀번호를 다시 입력하세요"
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="ui-button ui-button-primary ui-button-lg auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '가입 중...' : '회원가입'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        이미 계정이 있나요?
                        <Link to="/login"> 로그인</Link>
                    </p>
                </div>
            </section>
        </Page>
    )
}

export default RegisterPage