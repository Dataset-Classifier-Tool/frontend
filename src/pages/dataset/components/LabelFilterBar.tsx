import type { LabelName } from '../../../types/label'

export type FrameFilter = 'all' | 'unlabeled' | LabelName

type LabelFilterBarProps = {
  filter: FrameFilter
  allFrameCount: number
  labelOptions: LabelName[]
  labelText: Record<LabelName, string>
  labelStats: Record<LabelName | 'total' | 'unlabeled', number>
  onChangeFilter: (filter: FrameFilter) => void
}

function LabelFilterBar({
  filter,
  allFrameCount,
  labelOptions,
  labelText,
  labelStats,
  onChangeFilter,
}: LabelFilterBarProps) {
  return (
    <div className="label-filter-bar">
      <button
        type="button"
        className={filter === 'all' ? 'filter-button active' : 'filter-button'}
        onClick={() => onChangeFilter('all')}
      >
        전체 {allFrameCount}
      </button>

      <button
        type="button"
        className={
          filter === 'unlabeled' ? 'filter-button active' : 'filter-button'
        }
        onClick={() => onChangeFilter('unlabeled')}
      >
        미분류 {labelStats.unlabeled}
      </button>

      {labelOptions.map((labelName) => (
        <button
          key={labelName}
          type="button"
          className={
            filter === labelName ? 'filter-button active' : 'filter-button'
          }
          onClick={() => onChangeFilter(labelName)}
        >
          {labelText[labelName]} {labelStats[labelName]}
        </button>
      ))}
    </div>
  )
}

export default LabelFilterBar