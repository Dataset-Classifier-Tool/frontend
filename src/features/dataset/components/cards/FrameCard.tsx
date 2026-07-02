import FrameImage from '../FrameImage'

import type { DatasetFrame } from '../../../../types/frame'
import type { LabelName } from '../../../../types/label'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type FrameCardProps = {
  datasetId: number
  frame: DatasetFrame
  frameIndex: number
  labelOptions: LabelOption[]
  onOpen: () => void
  onLabel: (frame: DatasetFrame, labelName: LabelName) => void
}

function getFrameLabel(frame: DatasetFrame): LabelName | null {
  return frame.labels?.[0]?.label_name ?? null
}

function getLabelOption(
  labelOptions: LabelOption[],
  labelName: LabelName | null,
) {
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
  frameIndex,
  labelOptions,
  onOpen,
  onLabel,
}: FrameCardProps) {
  const currentLabel = getFrameLabel(frame)
  const labelOption = getLabelOption(labelOptions, currentLabel)
  const labelText = labelOption?.label ?? '미분류'
  const labelClassName = labelOption?.className ?? 'dataset-label-unlabeled'

  return (
    <article
      className={`dataset-frame-card ui-card ui-card-hover ${
        currentLabel ? 'is-labeled' : 'is-unlabeled'
      }`}
      onClick={onOpen}
    >
      <div className="dataset-frame-image">
        <FrameImage
          datasetId={datasetId}
          frameId={frame.id}
          alt={`frame-${frame.id}`}
        />

        <div className="dataset-frame-image-overlay">
          <span>클릭해서 크게 보기</span>
        </div>

        <div className="dataset-frame-index">
          #{String(frameIndex + 1).padStart(2, '0')}
        </div>
      </div>

      <div className="dataset-frame-body">
        <div className="dataset-frame-head">
          <div>
            <h3 className="dataset-frame-title">Frame #{frame.frame_number}</h3>
            <p className="dataset-frame-time">
              {formatTimestamp(frame.timestamp)}
            </p>
          </div>

          <span className={`ui-badge ${labelClassName}`}>{labelText}</span>
        </div>

        <div className="dataset-frame-status">
          <span>{currentLabel ? '라벨 지정 완료' : '라벨 지정 필요'}</span>
          <strong>{labelOption?.shortcut ?? '?'}</strong>
        </div>

        <div className="dataset-frame-label-actions">
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
              title={`${option.label} 라벨 지정`}
            >
              <span>{option.shortcut}</span>
              <strong>{option.label}</strong>
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export default FrameCard