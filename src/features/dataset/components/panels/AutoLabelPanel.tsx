type AutoLabelPanelProps = {
  disabled?: boolean
  isRunningMock?: boolean
  mockBoxCount?: number
  onRunMock?: () => void
}

function AutoLabelPanel({
  disabled = false,
  isRunningMock = false,
  mockBoxCount = 0,
  onRunMock,
}: AutoLabelPanelProps) {
  return (
    <article className="dataset-side-panel dataset-auto-label-panel ui-card">
      <div className="dataset-side-panel-head">
        <div>
          <span className="ui-badge ui-badge-primary">Auto Label</span>
          <h2>AI 자동 라벨링</h2>
          <p>
            현재는 Mock 분석으로 검수 흐름을 확인하고, 이후 실제 딥러닝 모델
            API로 교체합니다.
          </p>
        </div>
      </div>

      <div className="dataset-auto-label-flow">
        <div>
          <span>01</span>
          <strong>Mock Ready</strong>
          <p>프론트/백엔드 저장 흐름 검증용 자동 박스를 생성합니다.</p>
        </div>

        <div>
          <span>02</span>
          <strong>Review</strong>
          <p>생성된 박스를 사람이 이동, 수정, 삭제, 라벨 변경합니다.</p>
        </div>

        <div>
          <span>03</span>
          <strong>Model API</strong>
          <p>나중에 YOLO/RT-DETR 추론 API로 그대로 교체합니다.</p>
        </div>
      </div>

      <div className="dataset-auto-label-summary">
        <div>
          <span>생성된 Mock Box</span>
          <strong>{mockBoxCount}</strong>
        </div>

        <div>
          <span>연결 상태</span>
          <strong>{disabled ? '프레임 필요' : 'Mock 가능'}</strong>
        </div>
      </div>

      <button
        type="button"
        className="ui-button ui-button-primary"
        onClick={onRunMock}
        disabled={disabled || isRunningMock || !onRunMock}
      >
        {isRunningMock ? 'Mock 분석 중...' : 'Mock Auto Label 실행'}
      </button>
    </article>
  )
}

export default AutoLabelPanel