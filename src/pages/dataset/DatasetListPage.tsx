function DatasetListPage() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>내 데이터셋</h1>
          <p>프로젝트 단위로 이미지와 라벨을 관리합니다.</p>
        </div>

        <button className="button primary">새 데이터셋 만들기</button>
      </div>

      <div className="grid">
        <article className="dataset-card">
          <span className="badge">Sample</span>
          <h2>도로 화재 데이터셋</h2>
          <p>도로 및 터널 환경의 화재, 연기, 차량 등화류 데이터셋</p>
          <small>이미지 0개</small>
        </article>

        <article className="dataset-card empty">
          <h2>아직 데이터셋이 없습니다</h2>
          <p>새 데이터셋을 만들고 이미지를 업로드해보세요.</p>
        </article>
      </div>
    </section>
  )
}

export default DatasetListPage