function PricingPage() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>요금제</h1>
          <p>사용량과 자동화 수준에 맞는 플랜을 선택하세요.</p>
        </div>
      </div>

      <div className="pricing-grid">
        <article className="pricing-card">
          <h2>Free</h2>
          <p className="price">₩0</p>
          <ul>
            <li>하루 10회 분류</li>
            <li>수동 라벨링</li>
            <li>기본 데이터셋 관리</li>
          </ul>
        </article>

        <article className="pricing-card featured">
          <h2>Premium</h2>
          <p className="price">추후 공개</p>
          <ul>
            <li>하루 100회 분류</li>
            <li>AI 자동 라벨링</li>
            <li>YOLO / COCO Export</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default PricingPage