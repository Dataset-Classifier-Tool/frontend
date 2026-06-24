import type { LabelCounts } from '../../../common/api/classifierApi'
import type { LabelName } from '../../../types/label'

type LabelStats = Record<LabelName | 'total' | 'unlabeled', number>

interface Props {
  labelOptions: LabelName[]
  labelStats: LabelStats
  autoLabelCounts: LabelCounts | null
  onRefresh: () => void
}

const LABEL_STAT_META: Record<
  LabelName | 'unlabeled',
  {
    title: string
    icon: string
    tone: string
  }
> = {
  unlabeled: {
    title: '미분류',
    icon: '○',
    tone: 'unlabeled',
  },
  fire: {
    title: 'fire',
    icon: '🔥',
    tone: 'fire',
  },
  smoke: {
    title: 'smoke',
    icon: '☁',
    tone: 'smoke',
  },
  carlight: {
    title: 'carlight',
    icon: '🚗',
    tone: 'carlight',
  },
  negative: {
    title: 'negative',
    icon: '⊘',
    tone: 'negative',
  },
  fire_smoke: {
    title: 'fire_smoke',
    icon: '🔥☁',
    tone: 'fire-smoke',
  },
  fire_smoke_carlight: {
    title: 'fire_smoke_carlight',
    icon: '🔥🚗',
    tone: 'mixed',
  },
}

export function LabelStatsPanel({
  labelOptions,
  labelStats,
  autoLabelCounts,
  onRefresh,
}: Props) {
  const statKeys: Array<LabelName | 'unlabeled'> = [
    'unlabeled',
    ...labelOptions,
  ]

  const statItems = statKeys.map((key) => {
    const count = labelStats[key]
    const percentage =
      labelStats.total > 0
        ? Math.round((count / labelStats.total) * 1000) / 10
        : 0

    return {
      key,
      count,
      percentage,
      ...LABEL_STAT_META[key],
    }
  })

  return (
    <>
      <div className="dataset-stats-card premium-stats-card">
        <div className="premium-stats-header">
          <div className="premium-stats-title-group">
            <div className="premium-stats-icon">▣</div>

            <div>
              <h3>데이터셋 라벨 현황</h3>
              <p>전체 프레임 기준 라벨 분포를 확인합니다.</p>
            </div>
          </div>

          <button
            type="button"
            className="stats-refresh-button"
            onClick={onRefresh}
          >
            ⟳ 통계 새로고침
          </button>
        </div>

        <div className="premium-stats-divider" />

        <div className="premium-stats-grid">
          <article className="premium-stat-card total-card">
            <div className="stat-icon-box total">▣</div>
            <span>전체 프레임</span>
            <div className="stat-count-row">
              <strong>{labelStats.total}</strong>
              <small>장</small>
            </div>
          </article>

          {statItems.map((item) => (
            <article className="premium-stat-card" key={item.key}>
              <div className={`stat-icon-box ${item.tone}`}>{item.icon}</div>

              <span>{item.title}</span>

              <div className="stat-count-row">
                <strong>{item.count}</strong>
                <small>장</small>
              </div>

              <em>{item.percentage}%</em>
            </article>
          ))}
        </div>

        <div className="label-ratio-panel">
          <div className="label-ratio-title">
            <strong>라벨 분포 비율</strong>
            <span>총 {labelStats.total}장 기준</span>
          </div>

          <div className="label-ratio-bar">
            {statItems.map((item) => (
              <div
                key={item.key}
                className={`label-ratio-segment ${item.tone}`}
                style={{
                  width: `${Math.max(item.percentage, item.count > 0 ? 2 : 0)}%`,
                }}
                title={`${item.title}: ${item.percentage}%`}
              />
            ))}
          </div>

          <div className="label-ratio-legend">
            {statItems.map((item) => (
              <div className="label-ratio-legend-item" key={item.key}>
                <span className={`legend-dot ${item.tone}`} />
                <strong>{item.percentage}%</strong>
                <em>{item.title}</em>
              </div>
            ))}
          </div>
        </div>
      </div>

      {autoLabelCounts && (
        <div className="auto-label-summary">
          <h3>방금 실행한 AI 자동 라벨링 결과</h3>

          <div className="auto-label-count-grid">
            {labelOptions.map((labelName) => (
              <div className="auto-label-count-item" key={labelName}>
                {labelName}
                <strong>{autoLabelCounts[labelName] ?? 0}장</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}