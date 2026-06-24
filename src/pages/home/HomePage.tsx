import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="home-page">
      <div className="hero">
        <span className="eyebrow">AI 학습 데이터 제작 플랫폼</span>

        <h1>
          데이터셋을 만들고,
          <br />
          라벨링하고,
          <br />
          학습 준비까지.
        </h1>

        <p className="hero-description">
          영상 업로드부터 프레임 추출, 수동 라벨링, AI 자동 라벨링,
          바운딩 박스 생성, 데이터셋 내보내기까지 한 번에 관리하는
          해커톤용 AI 데이터셋 제작 도구입니다.
        </p>

        <div className="hero-actions">
          <Link to="/datasets" className="button primary">
            데이터셋 시작하기
          </Link>

          <Link to="/pricing" className="button secondary">
            요금제 보기
          </Link>
        </div>
      </div>

      <section className="feature-section">
        <span className="eyebrow">주요 기능</span>
        <h2>AI 학습 데이터 제작에 필요한 흐름을 하나로 연결합니다.</h2>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>영상 업로드</h3>
            <p>
              MP4 영상을 데이터셋에 업로드하고 프로젝트 단위로 관리합니다.
            </p>
          </article>

          <article className="feature-card">
            <h3>프레임 자동 추출</h3>
            <p>
              OpenCV를 기반으로 설정한 간격마다 영상 프레임을 자동 추출합니다.
            </p>
          </article>

          <article className="feature-card">
            <h3>수동 라벨링</h3>
            <p>
              화재, 연기, 차량 등화류, 정상 상황 등 프레임별 라벨을 직접 지정합니다.
            </p>
          </article>

          <article className="feature-card">
            <h3>AI 자동 라벨링</h3>
            <p>
              초기 자동 분류 로직을 활용해 라벨링 시간을 줄이고 검수 흐름을 만듭니다.
            </p>
          </article>

          <article className="feature-card">
            <h3>바운딩 박스</h3>
            <p>
              객체 탐지 모델 학습을 위해 프레임 위에 박스 좌표를 생성합니다.
            </p>
          </article>

          <article className="feature-card">
            <h3>데이터셋 내보내기</h3>
            <p>
              라벨링된 프레임을 ZIP으로 다운로드하고 추후 YOLO/COCO 형식으로 확장합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="workflow-section">
        <span className="eyebrow">작업 흐름</span>
        <h2>업로드부터 학습 준비까지 이어지는 전체 파이프라인</h2>

        <div className="workflow">
          <span>영상 업로드</span>
          <span>→</span>
          <span>프레임 추출</span>
          <span>→</span>
          <span>라벨링</span>
          <span>→</span>
          <span>바운딩 박스</span>
          <span>→</span>
          <span>검수</span>
          <span>→</span>
          <span>내보내기</span>
        </div>
      </section>

      <section className="label-section">
        <span className="eyebrow">지원 라벨</span>
        <h2>도로·터널 화재 감지를 위한 주요 분류 기준</h2>

        <div className="label-grid">
          <article className="label-card">🔥 화재</article>
          <article className="label-card">☁️ 연기</article>
          <article className="label-card">🚗 차량 등화류</article>
          <article className="label-card">✅ 정상 / 오탐 아님</article>
        </div>
      </section>

      <section className="progress-section">
        <span className="eyebrow">프로젝트 현황</span>
        <h2>현재는 데이터셋 제작 플랫폼 MVP 단계입니다.</h2>

        <div className="progress-grid">
          <article className="progress-card">
            <strong>85%</strong>
            <span>백엔드 MVP</span>
          </article>

          <article className="progress-card">
            <strong>80%</strong>
            <span>프론트엔드 MVP</span>
          </article>

          <article className="progress-card">
            <strong>45%</strong>
            <span>딥러닝 포함 전체 프로젝트</span>
          </article>
        </div>
      </section>
    </section>
  )
}

export default HomePage