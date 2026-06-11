function HomePage() {
  return (
    <section className="hero">
      <p className="eyebrow">AI Dataset Workflow Platform</p>

      <h1>
        Build cleaner datasets
        <br />
        faster than ever.
      </h1>

      <p className="hero-description">
        이미지와 영상을 업로드하고, 데이터셋 프로젝트 단위로 정리하며,
        라벨링과 검수, 학습용 내보내기까지 한 번에 관리하는 플랫폼입니다.
      </p>

      <div className="hero-actions">
        <a href="/datasets" className="button primary">
          데이터셋 시작하기
        </a>
        <a href="/pricing" className="button secondary">
          요금제 보기
        </a>
      </div>
    </section>
  )
}

export default HomePage