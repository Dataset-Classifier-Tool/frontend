function LoginPage() {
  return (
    <section className="page-card">
      <h1>로그인</h1>
      <p>Dataset Classifier Tool에 다시 오신 것을 환영합니다.</p>

      <form className="form">
        <label>
          이메일
          <input type="email" placeholder="test@test.com" />
        </label>

        <label>
          비밀번호
          <input type="password" placeholder="비밀번호" />
        </label>

        <button type="button" className="button primary full">
          로그인
        </button>
      </form>
    </section>
  )
}

export default LoginPage