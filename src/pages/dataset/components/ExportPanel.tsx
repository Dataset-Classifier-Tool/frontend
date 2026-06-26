type ExportPanelProps = {
  isExporting: boolean
  onDownloadZip: () => void
  onDownloadYolo: () => void
}

function ExportPanel({
  isExporting,
  onDownloadZip,
  onDownloadYolo,
}: ExportPanelProps) {
  return (
    <article className="ui-card dataset-side-card">
      <span className="ui-badge ui-badge-primary">Export</span>

      <div className="dataset-export-panel">
        <div>
          <h3>데이터셋 내보내기</h3>
          <p>
            라벨링된 프레임을 일반 ZIP 또는 YOLO 학습 구조로 다운로드합니다.
          </p>
        </div>

        <div className="dataset-workflow-list">
          <button
            type="button"
            className="ui-button ui-button-secondary"
            onClick={onDownloadZip}
            disabled={isExporting}
          >
            ZIP Export
          </button>

          <button
            type="button"
            className="ui-button ui-button-primary"
            onClick={onDownloadYolo}
            disabled={isExporting}
          >
            YOLO Export
          </button>
        </div>
      </div>
    </article>
  )
}

export default ExportPanel