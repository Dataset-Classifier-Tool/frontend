type LabelStats = {
  fire: number
  smoke: number
  carlight: number
  negative: number
  unlabeled: number
}

type LabelStatsPanelProps = {
  stats: LabelStats
  totalCount: number
  labeledCount: number
  progress: number
}

function LabelStatsPanel({
  stats,
  totalCount,
  labeledCount,
  progress,
}: LabelStatsPanelProps) {
  return (
    <>
      <article className="ui-card dataset-side-card">
        <span className="ui-badge ui-badge-primary">Progress</span>

        <h2>{progress}%</h2>

        <div className="dataset-progress-line">
          <i style={{ width: `${progress}%` }} />
        </div>

        <p>
          전체 {totalCount}개 중 {labeledCount}개 프레임이 라벨링되었습니다.
        </p>
      </article>

      <article className="ui-card dataset-side-card">
        <span className="ui-badge ui-badge-primary">Label Stats</span>

        <div className="dataset-label-stats">
          <div>
            <span>화재</span>
            <strong>{stats.fire}</strong>
          </div>

          <div>
            <span>연기</span>
            <strong>{stats.smoke}</strong>
          </div>

          <div>
            <span>차량 등화류</span>
            <strong>{stats.carlight}</strong>
          </div>

          <div>
            <span>일반/오탐</span>
            <strong>{stats.negative}</strong>
          </div>

          <div>
            <span>미분류</span>
            <strong>{stats.unlabeled}</strong>
          </div>
        </div>
      </article>
    </>
  )
}

export default LabelStatsPanel