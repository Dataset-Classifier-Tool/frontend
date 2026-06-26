function UploadFlowPanel() {
  return (
    <article className="upload-flow-card ui-card">
      <h3>처리 흐름</h3>

      <ol>
        <li>원천 영상 업로드</li>
        <li>지정 간격으로 프레임 추출</li>
        <li>데이터셋에 이미지 저장</li>
        <li>수동 라벨링 또는 자동 라벨링</li>
        <li>Bounding Box / YOLO Export로 확장</li>
      </ol>
    </article>
  )
}

export default UploadFlowPanel