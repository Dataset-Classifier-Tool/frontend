function PricingPage() {
  return (
    <section>
      <div className="pricing-hero">
        <span className="eyebrow">Pricing</span>
        <h1>요금제</h1>
        <p>
          데이터셋 규모와 자동화 수준에 맞춰 플랜을 선택하세요.
          현재는 MVP 시연용 정책 기준입니다.
        </p>
      </div>

      <div className="pricing-grid">
        <article className="pricing-card">
          <div className="pricing-card-header">
            <span className="pricing-badge free">Starter</span>
            <h2>Free</h2>
            <p>개인 테스트와 소규모 라벨링에 적합합니다.</p>
          </div>

          <div className="pricing-price">
            ₩0
            <span>/ month</span>
          </div>

          <ul className="pricing-feature-list">
            <li>하루 10회 분류</li>
            <li>수동 라벨링</li>
            <li>기본 데이터셋 관리</li>
            <li>라벨별 ZIP 다운로드</li>
          </ul>

          <button type="button" className="button secondary full">
            현재 플랜
          </button>
        </article>

        <article className="pricing-card featured">
          <div className="pricing-recommend">추천</div>

          <div className="pricing-card-header">
            <span className="pricing-badge premium">Professional</span>
            <h2>Premium</h2>
            <p>AI 자동 라벨링과 Export 기능을 활용하는 플랜입니다.</p>
          </div>

          <div className="pricing-price">
            출시 예정
            <span>coming soon</span>
          </div>

          <ul className="pricing-feature-list">
            <li>하루 100회 분류</li>
            <li>AI 자동 라벨링</li>
            <li>Bounding Box 관리</li>
            <li>YOLO / COCO Export</li>
            <li>프리미엄 데이터셋 워크플로우</li>
          </ul>

          <button type="button" className="button primary full">
            준비 중
          </button>
        </article>
      </div>

      <div className="pricing-note-card">
        <strong>향후 확장 예정</strong>
        <p>
          Premium 플랜에는 자동 라벨링, 대량 Export, 학습용 데이터셋 포맷 변환,
          사용량 제한 관리 기능이 포함될 예정입니다.
        </p>
      </div>
    </section>
  )
}

export default PricingPage