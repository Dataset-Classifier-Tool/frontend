import type { DatasetFrame } from '../../../types/frame'
import type { LabelName } from '../../../types/label'

import FrameCard from './cards/FrameCard'

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
      <div className="dataset-frame-empty ui-card">
        <div className="dataset-frame-empty-icon">🖼️</div>

        <div>
          <h3>표시할 프레임이 없습니다</h3>
          <p>필터를 변경하거나 영상을 추가로 업로드해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="dataset-frame-grid-wrap">
      <div className="dataset-frame-grid-head">
        <div>
          <span className="ui-badge ui-badge-primary">Frame Browser</span>
          <h2>프레임 라벨링</h2>
          <p>프레임을 클릭하면 크게 확인하고 단축키로 빠르게 라벨링할 수 있습니다.</p>
        </div>

        <div className="dataset-frame-grid-guide">
          <span>F 화재</span>
          <span>S 연기</span>
          <span>C 등화류</span>
          <span>N 일반</span>
        </div>
      </div>

      <div className="dataset-frame-grid">
        {frames.map((frame, frameIndex) => (
          <FrameCard
            key={frame.id}
            datasetId={datasetId}
            frame={frame}
            frameIndex={frameIndex}
            labelOptions={labelOptions}
            onOpen={() => onOpenFrame(frameIndex)}
            onLabel={onLabelFrame}
          />
        ))}
      </div>
    </section>
  )
}

export default FrameGrid