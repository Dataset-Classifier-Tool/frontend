import type { DatasetFrame } from '../../../types/frame'
import type { LabelName } from '../../../types/label'
import { FrameCard } from './FrameCard'

interface Props {
  frames: DatasetFrame[]
  labelOptions: LabelName[]
  isLabelLoading: boolean
  onSelectFrame: (frame: DatasetFrame) => void
  onCreateLabel: (frameId: number, labelName: LabelName) => void
  onDeleteLabel: (frameId: number, labelId: number) => void
}

export function FrameGrid({
  frames,
  labelOptions,
  isLabelLoading,
  onSelectFrame,
  onCreateLabel,
  onDeleteLabel,
}: Props) {
  if (frames.length === 0) {
    return (
      <article className="dataset-card empty">
        <h2>조건에 맞는 프레임이 없습니다</h2>
        <p>필터를 변경하거나 영상을 추가로 업로드해보세요.</p>
      </article>
    )
  }

  return (
    <div className="frame-preview-grid professional-grid">
      {frames.map((frame) => (
        <FrameCard
          key={frame.id}
          frame={frame}
          labelOptions={labelOptions}
          isLabelLoading={isLabelLoading}
          onSelectFrame={onSelectFrame}
          onCreateLabel={onCreateLabel}
          onDeleteLabel={onDeleteLabel}
        />
      ))}
    </div>
  )
}