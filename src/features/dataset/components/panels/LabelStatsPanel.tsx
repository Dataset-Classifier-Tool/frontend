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

const LABEL_STAT_ITEMS = [
  {
    key: 'fire',
    label: '화재',
    icon: '🔥',
    className: 'dataset-label-fire',
  },
  {
    key: 'smoke',
    label: '연기',
    icon: '🌫️',
    className: 'dataset-label-smoke',
  },
  {
    key: 'carlight',
    label: '차량 등화류',
    icon: '💡',
    className: 'dataset-label-carlight',
  },
  {
    key: 'negative',
    label: '일반 / 오탐',
    icon: '✅',
    className: 'dataset-label-negative',
  },
  {
    key: 'unlabeled',
    label: '미분류',
    icon: '🏷️',
    className: 'dataset-label-unlabeled',
  },
] as const

function getPercent(value: number, total: number) {
  if (total === 0) return 0

  return Math.round((value / total) * 100)
}

function LabelStatsPanel({
  stats,
  totalCount,
  labeledCount,
  progress,
}: LabelStatsPanelProps) {
  return (
    <article className="dataset-side-panel dataset-label-stats-panel ui-card">
      <div className="dataset-side-panel-head">
        <div>
          <span className="ui-badge ui-badge-primary">Label Stats</span>
          <h2>라벨링 현황</h2>
          <p>현재 데이터셋의 라벨 분포와 미분류 상태를 확인합니다.</p>
        </div>
      </div>

      <div className="dataset-label-progress-card">
        <div
          className="dataset-label-progress-ring"
          style={{
            background: `conic-gradient(var(--primary-color) ${
              progress * 3.6
            }deg, rgba(255, 255, 255, 0.08) 0deg)`,
          }}
        >
          <div>
            <strong>{progress}%</strong>
            <span>완료율</span>
          </div>
        </div>

        <div className="dataset-label-progress-meta">
          <div>
            <span>전체</span>
            <strong>{totalCount}</strong>
          </div>

          <div>
            <span>완료</span>
            <strong>{labeledCount}</strong>
          </div>
        </div>
      </div>

      <div className="dataset-label-stat-list">
        {LABEL_STAT_ITEMS.map((item) => {
          const value = stats[item.key]
          const percent = getPercent(value, totalCount)

          return (
            <div className="dataset-label-stat-item" key={item.key}>
              <div className={`dataset-label-stat-icon ${item.className}`}>
                {item.icon}
              </div>

              <div className="dataset-label-stat-content">
                <div className="dataset-label-stat-title">
                  <strong>{item.label}</strong>
                  <span>{percent}%</span>
                </div>

                <div className="dataset-label-stat-bar">
                  <i style={{ width: `${percent}%` }} />
                </div>
              </div>

              <em>{value}</em>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default LabelStatsPanel