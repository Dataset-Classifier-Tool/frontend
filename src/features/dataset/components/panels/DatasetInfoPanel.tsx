import type { Dataset } from '../../../../types/dataset'

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
    <article className="dataset-side-panel dataset-info-panel ui-card">
      <div className="dataset-side-panel-head">
        <div>
          <span className="ui-badge ui-badge-primary">Dataset Info</span>
          <h2>데이터셋 정보</h2>
          <p>현재 작업 중인 데이터셋의 기본 정보를 확인합니다.</p>
        </div>
      </div>

      <div className="dataset-info-summary">
        <div className="dataset-info-icon">📁</div>

        <div>
          <strong>{dataset.name}</strong>
          <span>{dataset.description || '설명이 없습니다.'}</span>
        </div>
      </div>

      <div className="dataset-info-list">
        <div>
          <span>Dataset ID</span>
          <strong>#{dataset.id}</strong>
        </div>

        <div>
          <span>생성일</span>
          <strong>{formatDate(dataset.created_at)}</strong>
        </div>

        <div>
          <span>원천 영상</span>
          <strong>{dataset.video_count ?? dataset.videos?.length ?? 0}개</strong>
        </div>

        <div>
          <span>프레임</span>
          <strong>{frameCount}개</strong>
        </div>

        <div>
          <span>Export 상태</span>
          <strong>{frameCount > 0 ? '준비 가능' : '프레임 필요'}</strong>
        </div>
      </div>
    </article>
  )
}

export default DatasetInfoPanel