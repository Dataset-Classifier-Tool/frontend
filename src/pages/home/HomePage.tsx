import { Link } from 'react-router-dom'

import { Page, StatCard, StatsGrid } from '../../common/ui'

const WORKFLOW_STEPS = [
  {
    number: '01',
    icon: '🗂️',
    title: '데이터셋 생성',
    description: '수집 목적과 라벨 기준을 정리한 프로젝트를 생성합니다.',
  },
  {
    number: '02',
    icon: '🎬',
    title: '영상 업로드',
    description: '도로·터널 원천 영상을 업로드하고 분석 준비를 시작합니다.',
  },
  {
    number: '03',
    icon: '🖼️',
    title: '프레임 추출',
    description: '지정한 간격으로 학습 후보 이미지를 자동 생성합니다.',
  },
  {
    number: '04',
    icon: '🏷️',
    title: '라벨링',
    description: '화재, 연기, 차량 등화류, 일반 데이터를 빠르게 분류합니다.',
  },
  {
    number: '05',
    icon: '📦',
    title: 'Export',
    description: '정리된 데이터를 ZIP 또는 YOLO 구조로 내보냅니다.',
  },
  {
    number: '06',
    icon: '🤖',
    title: 'AI 확장',
    description: '자동 라벨링과 Bounding Box 기능으로 확장합니다.',
  },
]

const FEATURE_CARDS = [
  {
    icon: '🔥',
    title: '화재 / 연기 데이터셋',
    description: '도로와 터널 환경에서 화재·연기 후보 프레임을 분류합니다.',
  },
  {
    icon: '💡',
    title: '등화류 오탐 분리',
    description: '차량 라이트, 반사광, 조명처럼 화재로 오인될 수 있는 데이터를 분리합니다.',
  },
  {
    icon: '📤',
    title: '학습용 Export',
    description: '수동 검수된 데이터셋을 YOLO 학습 파이프라인과 연결합니다.',
  },
]

function HomePage() {
  return (
    <Page>
      <section className="home-hero ui-card">
        <div className="home-hero-content">
          <div className="ui-badge ui-badge-primary">AI Dataset Platform</div>

          <h1 className="home-hero-title">
            영상에서 학습 데이터셋까지,
            <br />
            한 번에 완성하는 <span>AI 라벨링 플랫폼</span>
          </h1>

          <p className="home-hero-description">
            도로·터널 화재, 연기, 차량 등화류 데이터를 업로드하고 프레임 추출,
            수동 라벨링, 검수, Export까지 하나의 작업 흐름으로 관리합니다.
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
          <div className="home-pipeline-card">
            <div className="home-pipeline-header">
              <span className="ui-badge ui-badge-primary">Current Flow</span>
              <strong>Dataset Build Pipeline</strong>
            </div>

            <div className="home-pipeline-list">
              <div>
                <span>01</span>
                <strong>Upload</strong>
                <small>원천 영상 등록</small>
              </div>

              <div>
                <span>02</span>
                <strong>Extract</strong>
                <small>프레임 자동 추출</small>
              </div>

              <div>
                <span>03</span>
                <strong>Label</strong>
                <small>수동 라벨링</small>
              </div>

              <div>
                <span>04</span>
                <strong>Export</strong>
                <small>YOLO 학습 구조</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsGrid>
        <StatCard label="핵심 흐름" value="6" help="생성부터 Export까지" />
        <StatCard label="지원 라벨" value="4" help="fire / smoke / carlight / negative" />
        <StatCard label="Export 형식" value="YOLO" help="학습 파이프라인 연결" />
        <StatCard label="다음 단계" value="AI" help="자동 라벨링 확장 예정" />
      </StatsGrid>

      <section className="home-section">
        <div className="home-section-head">
          <span className="ui-badge ui-badge-primary">Workflow</span>
          <h2>데이터셋 제작 흐름</h2>
          <p>업로드부터 학습 데이터 Export까지 하나의 구조로 이어집니다.</p>
        </div>

        <div className="home-workflow-grid">
          {WORKFLOW_STEPS.map((step) => (
            <article className="home-workflow-card ui-card ui-card-hover" key={step.number}>
              <div className="home-workflow-top">
                <span>{step.number}</span>
                <div>{step.icon}</div>
              </div>

              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <span className="ui-badge ui-badge-primary">Core Features</span>
          <h2>프로젝트 핵심 기능</h2>
          <p>도로 화재 데이터셋 제작에 필요한 핵심 기능을 우선 완성했습니다.</p>
        </div>

        <div className="home-feature-grid">
          {FEATURE_CARDS.map((feature) => (
            <article className="home-feature-card ui-card ui-card-hover" key={feature.title}>
              <div className="home-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </Page>
  )
}

export default HomePage