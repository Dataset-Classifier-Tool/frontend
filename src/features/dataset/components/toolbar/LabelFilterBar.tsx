import type { LabelName } from '../../../../types/label'

type LabelFilter =
  | LabelName
  | 'all'
  | 'unlabeled'
  | 'no_bbox'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type LabelFilterBarProps = {
  selectedLabel: LabelFilter
  labelOptions: LabelOption[]
  onChangeLabel: (label: LabelFilter) => void
}

function LabelFilterBar({
  selectedLabel,
  labelOptions,
  onChangeLabel,
}: LabelFilterBarProps) {
  return (
    <div className="label-filter-bar">

      <button
        type="button"
        className={selectedLabel === 'all' ? 'active' : ''}
        onClick={() => onChangeLabel('all')}
      >
        <span>ALL</span>
        전체
      </button>

      <button
        type="button"
        className={
          selectedLabel === 'unlabeled'
            ? 'active'
            : ''
        }
        onClick={() =>
          onChangeLabel(
            'unlabeled',
          )
        }
      >
        <span>?</span>
        미분류
      </button>

      <button
        type="button"
        className={
          selectedLabel === 'no_bbox'
            ? 'active'
            : ''
        }
        onClick={() =>
          onChangeLabel(
            'no_bbox',
          )
        }
      >
        <span>□</span>
        박스 없음
      </button>

      {labelOptions.map((option) => (

        <button
          key={option.value}
          type="button"
          className={`

          ${
            selectedLabel ===
            option.value

              ? 'active'

              : ''

          }

          ${option.className}

          `}
          onClick={() =>
            onChangeLabel(
              option.value,
            )
          }
        >

          <span>

            {option.shortcut}

          </span>

          {option.label}

        </button>

      ))}

    </div>
  )
}

export default LabelFilterBar