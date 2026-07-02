import type { YoloExportMeta } from '../../api/exportApi'

type ExportPanelProps = {
  isExporting: boolean
  yoloMeta: YoloExportMeta | null
  isLoadingYoloMeta: boolean
  onDownloadZip: () => void
  onDownloadYolo: () => void
  onRefreshYoloMeta: () => void
}

function getExportStatusText(yoloMeta: YoloExportMeta | null) {
  if (!yoloMeta) return '상태 확인 필요'
  if (yoloMeta.available) return 'Export 가능'
  if (yoloMeta.export_frame_count === 0) return '프레임 없음'
  if (yoloMeta.export_box_count === 0) return 'Bounding Box 없음'

  return 'Export 준비 필요'
}

function getExportGuideText(yoloMeta: YoloExportMeta | null) {
  if (!yoloMeta) {
    return 'YOLO Export 상태를 새로고침해서 현재 데이터셋 상태를 확인하세요.'
  }

  if (yoloMeta.available) {
    return '현재 데이터셋은 YOLO 학습용 ZIP으로 내보낼 수 있습니다.'
  }

  if (yoloMeta.export_frame_count === 0) {
    return '프레임이 없어서 Export할 수 없습니다. 먼저 영상을 업로드하세요.'
  }

  if (yoloMeta.export_box_count === 0) {
    return 'Bounding Box가 없어서 YOLO Export를 만들 수 없습니다.'
  }

  return '라벨과 Bounding Box 상태를 확인한 뒤 다시 시도하세요.'
}

function ExportPanel({
  isExporting,
  yoloMeta,
  isLoadingYoloMeta,
  onDownloadZip,
  onDownloadYolo,
  onRefreshYoloMeta,
}: ExportPanelProps) {
  const canDownloadYolo = Boolean(yoloMeta?.available)

  return (
    <article className="dataset-side-panel dataset-export-side-panel ui-card">
      <div className="dataset-side-panel-head">
        <div>
          <span className="ui-badge ui-badge-primary">Export</span>
          <h2>데이터 내보내기</h2>
          <p>라벨링된 데이터를 학습 가능한 구조로 변환합니다.</p>
        </div>

        <button
          type="button"
          className="ui-button ui-button-secondary"
          onClick={onRefreshYoloMeta}
          disabled={isLoadingYoloMeta}
        >
          {isLoadingYoloMeta ? '확인 중...' : '새로고침'}
        </button>
      </div>

      <div className="dataset-yolo-status-card">
        <span>YOLO Export 상태</span>
        <strong>
          {isLoadingYoloMeta ? '확인 중...' : getExportStatusText(yoloMeta)}
        </strong>
        <p>{getExportGuideText(yoloMeta)}</p>
      </div>

      <div className="dataset-export-format-list">
        <div className="dataset-export-format-card">
          <span>Archive</span>
          <strong>ZIP Dataset</strong>
          <p>라벨링된 프레임 이미지를 라벨별 폴더로 다운로드합니다.</p>
        </div>

        <div className="dataset-export-format-card">
          <span>Train</span>
          <strong>YOLO Format</strong>
          <p>Bounding Box 기반 YOLO 학습 데이터셋을 생성합니다.</p>
        </div>
      </div>

      {yoloMeta && (
        <div className="dataset-yolo-meta-card">
          <div className="dataset-yolo-meta-grid">
            <div>
              <span>프레임</span>
              <strong>{yoloMeta.export_frame_count}</strong>
            </div>

            <div>
              <span>박스</span>
              <strong>{yoloMeta.export_box_count}</strong>
            </div>

            <div>
              <span>Train</span>
              <strong>{yoloMeta.train_frame_count}</strong>
            </div>

            <div>
              <span>Val</span>
              <strong>{yoloMeta.val_frame_count}</strong>
            </div>
          </div>

          <div className="dataset-yolo-class-list">
            {Object.entries(yoloMeta.class_counts).map(([label, count]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dataset-export-actions">
        <button
          type="button"
          className="ui-button ui-button-secondary"
          onClick={onDownloadZip}
          disabled={isExporting}
        >
          ZIP 다운로드
        </button>

        <button
          type="button"
          className="ui-button ui-button-primary"
          onClick={onDownloadYolo}
          disabled={isExporting || !canDownloadYolo}
        >
          YOLO 다운로드
        </button>
      </div>
    </article>
  )
}

export default ExportPanel