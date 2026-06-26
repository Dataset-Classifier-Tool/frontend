import { Link } from 'react-router-dom'

import { Page, StatCard, StatsGrid } from '../../common/components/ui'

function HomePage() {
  return (
    <Page>
      <section className="home-hero ui-card">
        <div className="home-hero-content">
          <div className="ui-badge ui-badge-primary">Dataset Classifier Tool</div>

          <h1 className="home-hero-title">
            영상에서 학습용 데이터셋까지,
            <br />
            한 번에 만드는 AI 라벨링 플랫폼
          </h1>

          <p className="home-hero-description">
            도로·터널 화재, 연기, 차량 등화류 데이터를 업로드하고 프레임 추출,
            수동 라벨링, Export까지 하나의 흐름으로 관리합니다.
          </p>

          <div className="home-hero-actions">
            <Link to="/datasets" className="ui-button ui-button-primary ui-button-lg">
              데이터셋 시작하기
            </Link>

            <Link to="/upload" className="ui-button ui-button-secondary ui-button-lg">
              영상 업로드
            </Link>
          </div>
        </div>

        <div className="home-hero-panel">
          <div className="home-terminal">
            <div className="home-terminal-header">
              <span />
              <span />
              <span />
            </div>

            <div className="home-terminal-body">
              <p>
                <span className="home-terminal-muted">$</span> upload tunnel_fire.mp4
              </p>
              <p>
                <span className="home-terminal-success">✓</span> 1,248 frames extracted
              </p>
              <p>
                <span className="home-terminal-success">✓</span> fire / smoke / carlight labels ready
              </p>
              <p>
                <span className="home-terminal-muted">$</span> export --format yolo
              </p>
              <p>
                <span className="home-terminal-success">✓</span> dataset_yolo.zip generated
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsGrid>
        <StatCard label="Core Flow" value="7" help="업로드부터 Export까지" />
        <StatCard label="Labels" value="4" help="fire / smoke / carlight / negative" />
        <StatCard label="Export" value="YOLO" help="학습 파이프라인 연결" />
        <StatCard label="Next" value="AI" help="자동 라벨링 확장 예정" />
      </StatsGrid>

      <section className="app-grid app-grid-3">
        <article className="home-feature-card ui-card">
          <div className="home-feature-icon">🎬</div>
          <h3>영상 업로드</h3>
          <p>MP4 영상을 업로드하고 지정한 간격으로 학습용 프레임을 추출합니다.</p>
        </article>

        <article className="home-feature-card ui-card">
          <div className="home-feature-icon">🏷️</div>
          <h3>수동 라벨링</h3>
          <p>프레임별로 화재, 연기, 차량 등화류, 일반 음성 데이터를 분류합니다.</p>
        </article>

        <article className="home-feature-card ui-card">
          <div className="home-feature-icon">📦</div>
          <h3>Export</h3>
          <p>정리된 데이터셋을 YOLO 학습 구조로 내보내 학습 파이프라인과 연결합니다.</p>
        </article>
      </section>
    </Page>
  )
}

export default HomePage