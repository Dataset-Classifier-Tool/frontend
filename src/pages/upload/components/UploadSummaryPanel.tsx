import type { Dataset } from '../../../types/dataset.ts'

type UploadSummaryPanelProps = {
  selectedDataset: Dataset | undefined
  file: File | null
  selectedFileSizeMb: number
  frameIntervalSeconds: number
  targetWidth: string
  autoLabel: boolean
}

function UploadSummaryPanel({
  selectedDataset,
  file,
  selectedFileSizeMb,
  frameIntervalSeconds,
  targetWidth,
  autoLabel,
}: UploadSummaryPanelProps) {
  return (
    <article className="upload-summary-card ui-card">
      <span className="ui-badge ui-badge-primary">Summary</span>

      <h2>업로드 요약</h2>

      <div className="upload-summary-row">
        <span>데이터셋</span>
        <strong>{selectedDataset?.name || '선택 필요'}</strong>
      </div>

      <div className="upload-summary-row">
        <span>파일</span>
        <strong>{file?.name || '선택 필요'}</strong>
      </div>

      <div className="upload-summary-row">
        <span>파일 크기</span>
        <strong>{file ? `${selectedFileSizeMb.toFixed(2)}MB` : '선택 필요'}</strong>
      </div>

      <div className="upload-summary-row">
        <span>추출 간격</span>
        <strong>{frameIntervalSeconds}초마다 1장</strong>
      </div>

      <div className="upload-summary-row">
        <span>저장 해상도</span>
        <strong>{targetWidth === 'original' ? '원본 유지' : `${targetWidth}px`}</strong>
      </div>

      <div className="upload-summary-row">
        <span>자동 라벨링</span>
        <strong>{autoLabel ? '사용' : '사용 안 함'}</strong>
      </div>
    </article>
  )
}

export default UploadSummaryPanel