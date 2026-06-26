import type { DatasetFrame } from '../../../types/frame'
import type { LabelName } from '../../../types/label'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type FrameCardProps = {
  datasetId: number
  frame: DatasetFrame
  labelOptions: LabelOption[]
  onOpen: () => void
  onLabel: (frame: DatasetFrame, labelName: LabelName) => void
}

function getFrameLabel(frame: DatasetFrame): LabelName | null {
  return frame.labels?.[0]?.label_name ?? null
}

function getLabelOption(labelOptions: LabelOption[], labelName: LabelName | null) {
  if (!labelName) return null

  return labelOptions.find((option) => option.value === labelName) ?? null
}

function formatTimestamp(timestamp: number | null) {
  if (timestamp === null || Number.isNaN(timestamp)) {
    return '0.0초'
  }

  return `${timestamp.toFixed(1)}초`
}

function FrameCard({
  datasetId,
  frame,
  labelOptions,
  onOpen,
  onLabel,
}: FrameCardProps) {
  const currentLabel = getFrameLabel(frame)
  const labelOption = getLabelOption(labelOptions, currentLabel)
  const labelText = labelOption?.label ?? '미분류'
  const labelClassName = labelOption?.className ?? ''

  return (
    <article className="dataset-frame-card ui-card ui-card-hover" onClick={onOpen}>
      <div className="dataset-frame-image">
        <img
          src={`/api/datasets/${datasetId}/frames/${frame.id}/image`}
          alt={`frame-${frame.id}`}
        />
      </div>

      <div className="dataset-frame-body">
        <div className="dataset-frame-head">
          <div>
            <h3 className="dataset-frame-title">Frame #{frame.frame_number}</h3>
            <p className="dataset-frame-time">{formatTimestamp(frame.timestamp)}</p>
          </div>

          <span className={`ui-badge ${currentLabel ? labelClassName : ''}`}>
            {labelText}
          </span>
        </div>

        <div className="dataset-frame-meta">
          {labelOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`dataset-label-button ${
                currentLabel === option.value ? 'active' : ''
              } ${option.className}`}
              onClick={(event) => {
                event.stopPropagation()
                onLabel(frame, option.value)
              }}
            >
              <span>{option.shortcut}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export default FrameCard