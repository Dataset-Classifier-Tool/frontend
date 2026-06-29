import { Link } from 'react-router-dom'

import { Page, PageHeader, StatCard, StatsGrid } from '../../common/ui'

type Plan = {
  name: string
  badge: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
  to: string
  actionText: string
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    badge: 'Starter',
    price: '무료',
    description: '개인 프로젝트와 기능 테스트에 적합한 기본 플랜입니다.',
    to: '/datasets',
    actionText: '무료로 시작하기',
    features: [
      '기본 데이터셋 생성',
      '영상 업로드 및 프레임 추출',
      '수동 라벨링',
      '일반 ZIP Export',
      '하루 10회 작업 제한',
    ],
  },
  {
    name: 'Premium',
    badge: 'Recommended',
    price: '월 구독',
    description: '본격적인 데이터셋 제작과 자동화 기능을 위한 플랜입니다.',
    highlighted: true,
    to: '/datasets',
    actionText: 'Premium 시작하기',
    features: [
      'Free 기능 전체 포함',
      '하루 100회 작업 가능',
      'AI 자동 라벨링',
      'YOLO Export',
      'Bounding Box 편집',
      '우선 기능 업데이트',
    ],
  },
  {
    name: 'Admin',
    badge: 'Operator',
    price: '관리자',
    description: '플랫폼 운영, 회원 관리, 사용량 제어를 위한 관리자 권한입니다.',
    to: '/admin/users',
    actionText: '관리자 콘솔 열기',
    features: [
      '회원 목록 조회',
      '회원 등급 변경',
      '계정 활성화 / 비활성화',
      '사용량 정책 관리',
      '전체 데이터셋 운영 관리',
    ],
  },
]

function PricingPage() {
  return (
    <Page className="pricing-page">
      <PageHeader
        badge="Membership"
        title="회원 등급"
        description="데이터셋 제작 규모와 자동화 수준에 따라 사용할 수 있는 기능을 구분합니다."
        actions={
          <Link to="/datasets" className="ui-button ui-button-primary">
            데이터셋 시작하기
          </Link>
        }
      />

      <section className="pricing-hero ui-card">
        <div className="pricing-hero-content">
          <span className="ui-badge ui-badge-primary">Scale your dataset</span>

          <h2>
            라벨링 작업이 커질수록
            <br />
            자동화가 중요해집니다.
          </h2>

          <p>
            Free 플랜으로 기본 흐름을 검증하고, Premium 플랜에서 자동 라벨링과
            YOLO Export를 연결해 실제 학습 파이프라인으로 확장할 수 있습니다.
          </p>

          <div className="pricing-hero-actions">
            <Link to="/datasets" className="ui-button ui-button-primary ui-button-lg">
              데이터셋 만들기
            </Link>

            <Link to="/upload" className="ui-button ui-button-secondary ui-button-lg">
              영상 업로드
            </Link>
          </div>
        </div>

        <div className="pricing-hero-metric">
          <strong>10x</strong>
          <span>Premium 작업 한도</span>
        </div>
      </section>

      <StatsGrid>
        <StatCard label="Free" value="10회" help="일일 기본 작업 한도" />
        <StatCard label="Premium" value="100회" help="일일 확장 작업 한도" />
        <StatCard label="Auto Label" value="Premium" help="자동 라벨링 권한" />
        <StatCard label="Admin" value="관리자" help="회원 및 정책 제어" />
      </StatsGrid>

      <section className="pricing-grid">
        {PLANS.map((plan) => (
          <article
            className={`pricing-card ui-card ui-card-hover ${
              plan.highlighted ? 'is-highlighted' : ''
            }`}
            key={plan.name}
          >
            {plan.highlighted && <div className="pricing-card-glow" />}

            <div className="pricing-card-header">
              <span
                className={`ui-badge ${
                  plan.highlighted ? 'ui-badge-primary' : ''
                }`}
              >
                {plan.badge}
              </span>

              <h2>{plan.name}</h2>

              <strong>{plan.price}</strong>

              <p>{plan.description}</p>
            </div>

            <ul className="pricing-feature-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to={plan.to}
              className={`ui-button ${
                plan.highlighted ? 'ui-button-primary' : 'ui-button-secondary'
              } pricing-card-button`}
            >
              {plan.actionText}
            </Link>
          </article>
        ))}
      </section>

      <section className="pricing-policy ui-card">
        <div className="pricing-policy-content">
          <span className="ui-badge ui-badge-primary">Policy</span>

          <h2>현재 적용 예정 정책</h2>

          <p>
            초기 MVP에서는 기능 검증을 우선하며, 이후 사용량 제한과 자동 라벨링
            권한을 백엔드 정책과 연결합니다.
          </p>
        </div>

        <div className="pricing-policy-grid">
          <div>
            <span>Free</span>
            <strong>10회 / 일</strong>
          </div>

          <div>
            <span>Premium</span>
            <strong>100회 / 일</strong>
          </div>

          <div>
            <span>Auto Labeling</span>
            <strong>Premium 이상</strong>
          </div>

          <div>
            <span>Admin Control</span>
            <strong>관리자 전용</strong>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default PricingPage