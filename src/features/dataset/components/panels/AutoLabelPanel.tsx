type AutoLabelPanelProps = {
  disabled?: boolean
  onRunAutoLabel?: () => void
}

function AutoLabelPanel({ disabled = true, onRunAutoLabel }: AutoLabelPanelProps) {
  return (
    <article className="ui-card dataset-side-card">
      <span className="ui-badge ui-badge-primary">Auto Labeling</span>

      <div className="dataset-auto-label-panel">
        <div>
          <h3>AI 자동 라벨링</h3>
          <p>
            학습된 모델을 사용해 프레임별 라벨 후보를 자동 생성합니다. 현재는
            UI 연결 단계이며, 이후 classifier API와 연동합니다.
          </p>
        </div>

        <div className="dataset-auto-label-status">
          <span>상태</span>
          <strong>{disabled ? '준비 중' : '사용 가능'}</strong>
        </div>

        <button
          type="button"
          className="ui-button ui-button-secondary"
          disabled={disabled}
          onClick={onRunAutoLabel}
        >
          자동 라벨링 실행
        </button>
      </div>
    </article>
  )
}

export default AutoLabelPanel