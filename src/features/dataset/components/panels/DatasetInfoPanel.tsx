import type { Dataset } from '../../../../types/dataset.ts'

type DatasetInfoPanelProps = {
  dataset: Dataset
  frameCount: number
}

function formatDate(dateText: string | null) {
  if (!dateText) return '날짜 없음'

  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) return '날짜 없음'

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function DatasetInfoPanel({ dataset, frameCount }: DatasetInfoPanelProps) {
  return (
    <article className="ui-card dataset-side-card">
      <span className="ui-badge ui-badge-primary">Dataset Info</span>

      <div className="dataset-info-list">
        <div>
          <span>데이터셋 ID</span>
          <strong>#{dataset.id}</strong>
        </div>

        <div>
          <span>생성일</span>
          <strong>{formatDate(dataset.created_at)}</strong>
        </div>

        <div>
          <span>영상 수</span>
          <strong>{dataset.video_count ?? 0}</strong>
        </div>

        <div>
          <span>프레임 수</span>
          <strong>{dataset.frame_count ?? frameCount}</strong>
        </div>
      </div>
    </article>
  )
}

export default DatasetInfoPanel