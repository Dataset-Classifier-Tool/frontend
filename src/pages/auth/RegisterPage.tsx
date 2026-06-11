function RegisterPage() {
  return (
    <section className="page-card">
      <h1>회원가입</h1>
      <p>무료 계정으로 하루 10회 데이터셋 분류 기능을 사용할 수 있습니다.</p>

      <form className="form">
        <label>
          이메일
          <input type="email" placeholder="test@test.com" />
        </label>

        <label>
          닉네임
          <input type="text" placeholder="도균" />
        </label>

        <label>
          비밀번호
          <input type="password" placeholder="8자 이상" />
        </label>

        <button type="button" className="button primary full">
          회원가입
        </button>
      </form>
    </section>
  )
}

export default RegisterPage