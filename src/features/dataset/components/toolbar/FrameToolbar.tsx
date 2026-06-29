import type { LabelName } from '../../../../types/label'

type LabelFilter = LabelName | 'all' | 'unlabeled'

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
    <div className="dataset-toolbar">
      <div className="dataset-toolbar-left">
        <span className="ui-badge ui-badge-primary">프레임 갤러리</span>
        <span className="ui-badge">
          {filteredCount} / {totalCount} 표시
        </span>
      </div>

      <div className="dataset-toolbar-right">
        <button
          type="button"
          className={`ui-button ui-button-sm ${
            selectedLabel === 'all' ? 'ui-button-primary' : 'ui-button-secondary'
          }`}
          onClick={() => onChangeLabel('all')}
        >
          전체
        </button>

        <button
          type="button"
          className={`ui-button ui-button-sm ${
            selectedLabel === 'unlabeled'
              ? 'ui-button-primary'
              : 'ui-button-secondary'
          }`}
          onClick={() => onChangeLabel('unlabeled')}
        >
          미분류
        </button>

        {labelOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`ui-button ui-button-sm ${
              selectedLabel === option.value
                ? 'ui-button-primary'
                : 'ui-button-secondary'
            }`}
            onClick={() => onChangeLabel(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FrameToolbar