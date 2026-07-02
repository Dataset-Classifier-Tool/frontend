const FLOW_STEPS = [
  '원천 영상 업로드',
  '지정 간격으로 프레임 추출',
  '데이터셋에 이미지 저장',
  '수동 라벨링 또는 자동 라벨링',
  'Bounding Box / YOLO Export로 확장',
]

function UploadFlowPanel() {
  return (
    <article className="upload-flow-card ui-card">
      <span className="ui-badge ui-badge-primary">Pipeline</span>

      <h3>처리 흐름</h3>

      <div className="upload-flow-list">
        {FLOW_STEPS.map((step, index) => (
          <div className="upload-flow-item" key={step}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

export default UploadFlowPanel