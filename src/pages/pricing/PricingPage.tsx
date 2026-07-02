import { Link } from 'react-router-dom'

import { Page, PageHeader, StatCard, StatsGrid } from '../../common/ui'

const PLANS = [
  {
    name: 'Free',
    badge: 'Basic',
    price: '₩0',
    desc: '개인 학습과 테스트용 데이터셋 제작에 적합합니다.',
    features: ['일일 10회 작업', '수동 라벨링', '프레임 조회', '기본 Export'],
    highlight: false,
  },
  {
    name: 'Premium',
    badge: 'Recommended',
    price: '₩9,900',
    desc: '더 많은 데이터셋 제작과 AI 자동화 기능을 사용할 수 있습니다.',
    features: ['일일 100회 작업', '자동 라벨링 예정', 'YOLO Export', '우선 처리'],
    highlight: true,
  },
  {
    name: 'Admin',
    badge: 'Operation',
    price: '관리자',
    desc: '사용자 권한과 서비스 운영 상태를 관리합니다.',
    features: ['회원 관리', '등급 변경', '활성 상태 관리', '운영 대시보드'],
    highlight: false,
  },
]

function PricingPage() {
  return (
    <Page className="pricing-page">
      <PageHeader
        badge="Membership"
        title="회원 등급"
        description="데이터셋 제작 사용량과 AI 기능 접근 권한을 등급별로 관리합니다."
      />

      <section className="pricing-hero ui-card">
        <div>
          <span className="ui-badge ui-badge-primary">Usage Policy</span>

          <h2>
            데이터셋 제작 규모에 맞춰
            <br />
            사용량과 AI 기능을 확장합니다.
          </h2>

          <p>
            현재는 Free, Premium, Admin 등급 구조를 기준으로 사용량 제한과
            자동 라벨링 권한을 연결할 수 있도록 설계되어 있습니다.
          </p>

          <div className="pricing-hero-actions">
            <Link to="/datasets" className="ui-button ui-button-primary ui-button-lg">
              데이터셋 시작하기
            </Link>

            <Link to="/admin/users" className="ui-button ui-button-secondary ui-button-lg">
              회원 관리
            </Link>
          </div>
        </div>
      </section>

      <StatsGrid>
        <StatCard label="Free" value="10회" help="일일 기본 작업량" />
        <StatCard label="Premium" value="100회" help="확장 작업량" />
        <StatCard label="AI 기능" value="예정" help="자동 라벨링 연결" />
        <StatCard label="관리자" value="운영" help="회원 등급 관리" />
      </StatsGrid>

      <section className="pricing-plan-grid">
        {PLANS.map((plan) => (
          <article
            className={`pricing-plan-card ui-card ui-card-hover ${
              plan.highlight ? 'is-highlight' : ''
            }`}
            key={plan.name}
          >
            <span className="ui-badge ui-badge-primary">{plan.badge}</span>

            <h2>{plan.name}</h2>

            <div className="pricing-price">{plan.price}</div>

            <p>{plan.desc}</p>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to={plan.name === 'Admin' ? '/admin/users' : '/datasets'}
              className={`ui-button ${
                plan.highlight ? 'ui-button-primary' : 'ui-button-secondary'
              }`}
            >
              {plan.name === 'Admin' ? '관리자 화면' : '시작하기'}
            </Link>
          </article>
        ))}
      </section>
    </Page>
  )
}

export default PricingPage