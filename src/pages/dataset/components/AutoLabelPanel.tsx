import type { LabelCounts } from '../../../common/api/classifierApi'

type AutoLabelPanelProps = {
  isAutoLabeling: boolean
  hasFrames: boolean
  autoLabelMessage: string
  autoLabelCounts: LabelCounts | null
  onAutoLabelClick: () => void
}

function AutoLabelPanel({
  isAutoLabeling,
  hasFrames,
  autoLabelMessage,
  autoLabelCounts,
  onAutoLabelClick,
}: AutoLabelPanelProps) {
  return (
    <article className="dataset-side-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">AI 자동 라벨링</span>
          <h2>프레임 자동 분류</h2>
          <p>
            현재 데이터셋의 프레임을 분석해서 화재, 연기, 차량 등화류,
            정상 데이터 후보를 자동으로 분류합니다.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="button primary full"
        disabled={isAutoLabeling || !hasFrames}
        onClick={onAutoLabelClick}
      >
        {isAutoLabeling ? 'AI 라벨링 중...' : 'AI 자동 라벨링 실행'}
      </button>

      {!hasFrames && (
        <p className="helper-text">
          자동 라벨링을 실행하려면 먼저 영상을 업로드하고 프레임을 추출해야
          합니다.
        </p>
      )}

      {autoLabelMessage && (
        <div className="alert success">{autoLabelMessage}</div>
      )}

      {autoLabelCounts && (
        <div className="auto-label-counts">
          <div>
            <span>화재</span>
            <strong>{autoLabelCounts.fire ?? 0}</strong>
          </div>

          <div>
            <span>연기</span>
            <strong>{autoLabelCounts.smoke ?? 0}</strong>
          </div>

          <div>
            <span>차량 등화류</span>
            <strong>{autoLabelCounts.carlight ?? 0}</strong>
          </div>

          <div>
            <span>정상</span>
            <strong>{autoLabelCounts.negative ?? 0}</strong>
          </div>
        </div>
      )}
    </article>
  )
}

export default AutoLabelPanel