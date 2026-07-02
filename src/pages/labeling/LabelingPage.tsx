import { Link } from 'react-router-dom'

import { Page, PageHeader, StatCard, StatsGrid } from '../../common/ui'

const LABELING_WORKFLOW = [
  {
    number: '01',
    title: '데이터셋 선택',
    description: '라벨링할 데이터셋을 선택하고 프레임 목록을 불러옵니다.',
  },
  {
    number: '02',
    title: '프레임 검수',
    description: '추출된 프레임을 확인하고 화재, 연기, 등화류, 일반 데이터로 분류합니다.',
  },
  {
    number: '03',
    title: '단축키 라벨링',
    description: 'F, S, C, N 단축키를 사용해 빠르게 라벨을 지정합니다.',
  },
  {
    number: '04',
    title: 'Export 준비',
    description: '검수된 데이터를 YOLO 또는 ZIP 구조로 내보낼 준비를 합니다.',
  },
]

const UPCOMING_FEATURES = [
  {
    icon: '▢',
    title: 'Bounding Box',
    description: '프레임 위에 객체 영역을 직접 지정하는 기능을 연결합니다.',
  },
  {
    icon: '🤖',
    title: 'Auto Label Review',
    description: 'AI가 생성한 사전 라벨을 사람이 검수하는 화면으로 확장합니다.',
  },
  {
    icon: '📦',
    title: 'YOLO Export',
    description: '라벨과 박스 정보를 학습 가능한 구조로 변환합니다.',
  },
]

function LabelingPage() {
  return (
    <Page className="labeling-page">
      <PageHeader
        badge="Labeling Workspace"
        title="라벨링 작업실"
        description="프레임 검수, 수동 라벨링, Bounding Box 작업으로 확장될 독립 작업 화면입니다."
        actions={
          <>
            <Link to="/datasets" className="ui-button ui-button-secondary">
              데이터셋 선택
            </Link>

            <Link to="/upload" className="ui-button ui-button-primary">
              영상 업로드
            </Link>
          </>
        }
      />

      <section className="labeling-hero ui-card">
        <div className="labeling-hero-content">
          <span className="ui-badge ui-badge-primary">Annotation Studio</span>

          <h2>
            프레임 라벨링에서
            <br />
            Bounding Box 작업까지 확장합니다.
          </h2>

          <p>
            현재 라벨링 기능은 데이터셋 상세 화면에 연결되어 있습니다. 이 작업실은
            이후 객체 탐지 학습을 위한 Bounding Box, AI 사전 라벨 검수, Export 검증
            화면으로 확장할 수 있습니다.
          </p>

          <div className="labeling-hero-actions">
            <Link to="/datasets" className="ui-button ui-button-primary ui-button-lg">
              데이터셋에서 라벨링 시작
            </Link>

            <Link to="/dashboard" className="ui-button ui-button-secondary ui-button-lg">
              대시보드 보기
            </Link>
          </div>
        </div>

        <div className="labeling-shortcut-card">
          <span className="ui-badge ui-badge-primary">Shortcuts</span>

          <div className="labeling-shortcut-grid">
            <div>
              <strong>F</strong>
              <span>화재</span>
            </div>

            <div>
              <strong>S</strong>
              <span>연기</span>
            </div>

            <div>
              <strong>C</strong>
              <span>등화류</span>
            </div>

            <div>
              <strong>N</strong>
              <span>일반</span>
            </div>

            <div>
              <strong>←</strong>
              <span>이전</span>
            </div>

            <div>
              <strong>→</strong>
              <span>다음</span>
            </div>
          </div>
        </div>
      </section>

      <StatsGrid>
        <StatCard label="현재 라벨" value="4" help="fire / smoke / carlight / negative" />
        <StatCard label="작업 방식" value="Manual" help="수동 검수 중심" />
        <StatCard label="다음 확장" value="BBox" help="객체 탐지 라벨링" />
        <StatCard label="목표 Export" value="YOLO" help="학습 데이터셋 변환" />
      </StatsGrid>

      <section className="labeling-section">
        <div className="labeling-section-head">
          <span className="ui-badge ui-badge-primary">Workflow</span>
          <h2>라벨링 작업 흐름</h2>
          <p>현재 구현된 수동 라벨링 흐름과 다음 확장 단계를 정리합니다.</p>
        </div>

        <div className="labeling-workflow-grid">
          {LABELING_WORKFLOW.map((step) => (
            <article className="labeling-workflow-card ui-card ui-card-hover" key={step.number}>
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="labeling-section">
        <div className="labeling-section-head">
          <span className="ui-badge ui-badge-primary">Expansion</span>
          <h2>다음 확장 기능</h2>
          <p>라벨링 화면은 Bounding Box와 AI 검수 화면으로 확장됩니다.</p>
        </div>

        <div className="labeling-feature-grid">
          {UPCOMING_FEATURES.map((feature) => (
            <article className="labeling-feature-card ui-card ui-card-hover" key={feature.title}>
              <div>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </Page>
  )
}

export default LabelingPage