type ExportPanelProps = {
  isExporting: boolean
  isYoloExporting: boolean
  isYoloMetaLoading: boolean
  labeledFrameCount: number
  totalFrameCount: number
  yoloExportFrameCount?: number
  yoloExportBoxCount?: number
  yoloTrainFrameCount?: number
  yoloValFrameCount?: number
  yoloClassCounts?: Record<string, number>
  onExportClick: () => void
  onYoloExportClick: () => void
  onRefreshYoloMeta: () => void
}

const YOLO_CLASS_TEXT: Record<string, string> = {
  fire: '화재',
  smoke: '연기',
  carlight: '차량 등화류',
}

function ExportPanel({
  isExporting,
  isYoloExporting,
  isYoloMetaLoading,
  labeledFrameCount,
  totalFrameCount,
  yoloExportFrameCount = 0,
  yoloExportBoxCount = 0,
  yoloTrainFrameCount = 0,
  yoloValFrameCount = 0,
  yoloClassCounts = {},
  onExportClick,
  onYoloExportClick,
  onRefreshYoloMeta,
}: ExportPanelProps) {
  const progress =
    totalFrameCount === 0
      ? 0
      : Math.round((labeledFrameCount / totalFrameCount) * 100)

  const canDownloadZip = labeledFrameCount > 0
  const canDownloadYolo = yoloExportFrameCount > 0 && yoloExportBoxCount > 0

  return (
    <article className="dataset-side-panel">
      <div className="panel-header export-panel-header">
        <div>
          <span className="eyebrow">데이터셋 Export</span>
          <h2>학습 데이터 다운로드</h2>

          <p>
            라벨링된 프레임을 일반 ZIP으로 다운로드하거나, Bounding Box가
            생성된 프레임을 YOLO 학습 형식으로 내보낼 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          className="button secondary small"
          disabled={isYoloMetaLoading}
          onClick={onRefreshYoloMeta}
        >
          {isYoloMetaLoading ? '갱신 중...' : 'YOLO 상태 갱신'}
        </button>
      </div>

      <div className="export-summary">
        <div className="export-item">
          <span>전체 프레임</span>
          <strong>{totalFrameCount}</strong>
        </div>

        <div className="export-item">
          <span>라벨링 완료</span>
          <strong>{labeledFrameCount}</strong>
        </div>

        <div className="export-item">
          <span>라벨 진행률</span>
          <strong>{progress}%</strong>
        </div>
      </div>

      <div className="export-progress">
        <div
          className="export-progress-bar"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="export-section-title">
        <strong>YOLO Export 상태</strong>
        <span>{canDownloadYolo ? '다운로드 가능' : 'Bounding Box 필요'}</span>
      </div>

      <div className="export-summary yolo">
        <div className="export-item">
          <span>YOLO 프레임</span>
          <strong>{yoloExportFrameCount}</strong>
        </div>

        <div className="export-item">
          <span>YOLO 박스</span>
          <strong>{yoloExportBoxCount}</strong>
        </div>

        <div className="export-item">
          <span>상태</span>
          <strong>{canDownloadYolo ? '가능' : '대기'}</strong>
        </div>
      </div>

      <div className="export-summary yolo">
        <div className="export-item">
          <span>Train</span>
          <strong>{yoloTrainFrameCount}</strong>
        </div>

        <div className="export-item">
          <span>Validation</span>
          <strong>{yoloValFrameCount}</strong>
        </div>

        <div className="export-item">
          <span>Split</span>
          <strong>
            {yoloExportFrameCount > 0
              ? `${yoloTrainFrameCount}:${yoloValFrameCount}`
              : '-'}
          </strong>
        </div>
      </div>

      <div className="yolo-class-counts">
        {Object.entries(YOLO_CLASS_TEXT).map(([className, text]) => (
          <div key={className}>
            <span>{text}</span>
            <strong>{yoloClassCounts[className] ?? 0}</strong>
          </div>
        ))}
      </div>

      <div className="export-button-stack">
        <button
          type="button"
          className="button secondary full"
          disabled={isExporting || !canDownloadZip}
          onClick={onExportClick}
        >
          {isExporting ? 'ZIP 생성 중...' : '일반 ZIP 다운로드'}
        </button>

        <button
          type="button"
          className="button primary full"
          disabled={isYoloExporting || !canDownloadYolo}
          onClick={onYoloExportClick}
        >
          {isYoloExporting ? 'YOLO ZIP 생성 중...' : 'YOLO Export 다운로드'}
        </button>
      </div>

      {!canDownloadZip && (
        <p className="helper-text">
          일반 ZIP 다운로드를 하려면 먼저 프레임에 라벨을 지정해야 합니다.
        </p>
      )}

      {!canDownloadYolo && (
        <p className="helper-text">
          YOLO Export를 하려면 fire, smoke, carlight Bounding Box가 필요합니다.
        </p>
      )}

      <div className="export-roadmap">
        <h3>YOLO Export 구조</h3>

        <ul>
          <li>images/train</li>
          <li>images/val</li>
          <li>labels/train</li>
          <li>labels/val</li>
          <li>data.yaml</li>
          <li>classes.txt</li>
        </ul>
      </div>
    </article>
  )
}

export default ExportPanel