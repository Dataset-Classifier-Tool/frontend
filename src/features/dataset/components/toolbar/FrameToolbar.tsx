import type { LabelName } from '../../../../types/label'

import LabelFilterBar from './LabelFilterBar'

type LabelFilter = LabelName | 'all' | 'unlabeled' | 'no_bbox'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type FrameToolbarProps = {
  totalCount: number
  filteredCount: number
  selectedLabel: LabelFilter
  labelOptions: LabelOption[]
  onChangeLabel: (label: LabelFilter) => void
}

function FrameToolbar({
  totalCount,
  filteredCount,
  selectedLabel,
  labelOptions,
  onChangeLabel,
}: FrameToolbarProps) {
  return (
    <section className="dataset-toolbar">
      <div className="dataset-toolbar-left">
        <div className="dataset-toolbar-title">
          <span className="ui-badge ui-badge-primary">Filter</span>
          <h2>프레임 필터</h2>
          <p>
            전체 {totalCount}개 중 {filteredCount}개 표시 중입니다.
          </p>
        </div>
      </div>

      <div className="dataset-toolbar-right">
        <LabelFilterBar
          selectedLabel={selectedLabel}
          labelOptions={labelOptions}
          onChangeLabel={onChangeLabel}
        />
      </div>
    </section>
  )
}

export default FrameToolbar