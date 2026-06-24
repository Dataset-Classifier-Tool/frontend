import { getFrameImageUrl } from '../../../common/api/uploadApi'

import type { DatasetFrame } from '../../../types/frame'
import type { LabelName } from '../../../types/label'

interface Props {
  frame: DatasetFrame
  labelOptions: LabelName[]
  isLabelLoading: boolean
  onSelectFrame: (frame: DatasetFrame) => void
  onCreateLabel: (frameId: number, labelName: LabelName) => void
  onDeleteLabel: (frameId: number, labelId: number) => void
}

const LABEL_TEXT: Record<LabelName, string> = {
  fire: '화재',
  smoke: '연기',
  carlight: '차량 등화류',
  negative: '정상',
  fire_smoke: '화재 + 연기',
  fire_smoke_carlight: '화재 + 연기 + 등화류',
}

export function FrameCard({
  frame,
  labelOptions,
  isLabelLoading,
  onSelectFrame,
  onCreateLabel,
  onDeleteLabel,
}: Props) {
  return (
    <article className="frame-preview-card professional-frame-card">
      <button
        type="button"
        className="frame-image-button"
        onClick={() => onSelectFrame(frame)}
      >
        <img
          className="frame-image"
          src={getFrameImageUrl(frame.id)}
          alt={`프레임 ${frame.frame_number}`}
        />
      </button>

      <div className="frame-card-meta">
        <strong>프레임 {frame.frame_number}</strong>
        <small>
          {frame.timestamp !== null
            ? `${frame.timestamp.toFixed(1)}초`
            : '시간 정보 없음'}
        </small>
      </div>

      <div className="frame-label-row">
        {frame.labels.length === 0 ? (
          <span className="label-chip empty">미분류</span>
        ) : (
          frame.labels.map((label) => (
            <span className="label-chip removable" key={label.id}>
              {LABEL_TEXT[label.label_name]}
              <button
                type="button"
                className="label-remove-button"
                onClick={() => onDeleteLabel(frame.id, label.id)}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      <div className="label-button-grid">
        {labelOptions.map((labelName) => (
          <button
            key={labelName}
            type="button"
            className="label-button"
            disabled={isLabelLoading}
            onClick={() => onCreateLabel(frame.id, labelName)}
          >
            {LABEL_TEXT[labelName]}
          </button>
        ))}
      </div>
    </article>
  )
}