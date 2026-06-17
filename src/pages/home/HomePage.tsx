import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <section className="home-page">
      <div className="hero">
        <div className="eyebrow">
          AI Dataset Creation Platform
        </div>

        <h1>
          Dataset
          <br />
          Classifier Tool
        </h1>

        <p className="hero-description">
          영상 업로드부터 프레임 추출,
          AI 자동 라벨링,
          Bounding Box 생성,
          데이터셋 검수까지.

          AI 학습용 데이터셋을
          빠르고 체계적으로 구축하기 위한 플랫폼입니다.
        </p>

        <div className="hero-actions">
          <button
            className="button primary"
            onClick={() => navigate('/datasets')}
          >
            데이터셋 시작하기
          </button>

          <button
            className="button secondary"
            onClick={() => navigate('/pricing')}
          >
            요금제 보기
          </button>
        </div>
      </div>

      <div className="feature-section">
        <h2>핵심 기능</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>영상 업로드</h3>
            <p>
              MP4 영상 업로드 및 프로젝트 관리
            </p>
          </div>

          <div className="feature-card">
            <h3>프레임 추출</h3>
            <p>
              원하는 간격으로 자동 프레임 생성
            </p>
          </div>

          <div className="feature-card">
            <h3>AI 자동 라벨링</h3>
            <p>
              Fire / Smoke / CarLight 자동 분류
            </p>
          </div>

          <div className="feature-card">
            <h3>Bounding Box</h3>
            <p>
              수동 및 AI 자동 박스 생성
            </p>
          </div>

        </div>
      </div>

      <div className="workflow-section">
        <h2>작업 흐름</h2>

        <div className="workflow">
          <span>영상 업로드</span>
          <span>→</span>

          <span>프레임 추출</span>
          <span>→</span>

          <span>AI 라벨링</span>
          <span>→</span>

          <span>검수</span>
          <span>→</span>

          <span>Export</span>
        </div>
      </div>

      <div className="label-section">
        <h2>지원 라벨</h2>

        <div className="label-grid">

          <div className="label-card">
            🔥 Fire
          </div>

          <div className="label-card">
            🌫 Smoke
          </div>

          <div className="label-card">
            🚗 CarLight
          </div>

          <div className="label-card">
            ⭕ Negative
          </div>

        </div>
      </div>

      <div className="progress-section">
        <h2>프로젝트 진행 현황</h2>

        <div className="progress-grid">

          <div className="progress-card">
            <strong>95%</strong>
            <span>Backend</span>
          </div>

          <div className="progress-card">
            <strong>90%</strong>
            <span>Frontend</span>
          </div>

          <div className="progress-card">
            <strong>85%</strong>
            <span>Dataset Platform</span>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HomePage