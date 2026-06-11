function UploadPage() {
  return (
    <section className="page-card wide">
      <h1>업로드</h1>
      <p>이미지 또는 영상을 업로드하여 데이터셋에 추가합니다.</p>

      <div className="upload-box">
        <strong>파일을 선택하거나 여기에 드래그하세요</strong>
        <span>JPG, PNG, MP4 지원 예정</span>
      </div>
    </section>
  )
}

export default UploadPage