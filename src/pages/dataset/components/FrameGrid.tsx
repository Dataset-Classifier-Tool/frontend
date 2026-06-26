import type { DatasetFrame } from '../../../types/frame'
import type { LabelName } from '../../../types/label'

import FrameCard from './FrameCard'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type FrameGridProps = {
  datasetId: number
  frames: DatasetFrame[]
  labelOptions: LabelOption[]
  onOpenFrame: (frameIndex: number) => void
  onLabelFrame: (frame: DatasetFrame, labelName: LabelName) => void
}

function FrameGrid({
  datasetId,
  frames,
  labelOptions,
  onOpenFrame,
  onLabelFrame,
}: FrameGridProps) {
  if (frames.length === 0) {
    return (
      <div className="ui-empty">
        <div>
          <h3 className="ui-empty-title">표시할 프레임이 없습니다</h3>
          <p className="ui-empty-description">
            필터를 변경하거나 영상을 추가로 업로드해주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="dataset-frame-grid">
      {frames.map((frame, frameIndex) => (
        <FrameCard
          key={frame.id}
          datasetId={datasetId}
          frame={frame}
          labelOptions={labelOptions}
          onOpen={() => onOpenFrame(frameIndex)}
          onLabel={onLabelFrame}
        />
      ))}
    </div>
  )
}

export default FrameGrid