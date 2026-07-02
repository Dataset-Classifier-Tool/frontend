type UploadSettingsGridProps = {
  frameIntervalSeconds: number
  targetWidth: string
  autoLabel: boolean
  isUploading: boolean
  onFrameIntervalChange: (value: number) => void
  onTargetWidthChange: (value: string) => void
  onAutoLabelChange: (checked: boolean) => void
  onUpload: () => void
}

function UploadSettingsGrid({
  frameIntervalSeconds,
  targetWidth,
  autoLabel,
  isUploading,
  onFrameIntervalChange,
  onTargetWidthChange,
  onAutoLabelChange,
  onUpload,
}: UploadSettingsGridProps) {
  return (
    <article className="upload-settings-card ui-card">
      <div className="upload-settings-head">
        <div>
          <span className="ui-badge ui-badge-primary">Upload Settings</span>
          <h2>추출 설정</h2>
          <p>프레임 간격, 저장 해상도, 자동 라벨링 옵션을 설정합니다.</p>
        </div>
      </div>

      <div className="upload-setting-grid">
        <div className="upload-setting-card">
          <span>프레임 추출 간격</span>

          <div className="upload-interval-control">
            <button
              type="button"
              onClick={() => onFrameIntervalChange(frameIntervalSeconds - 1)}
              disabled={isUploading}
            >
              -
            </button>

            <strong>{frameIntervalSeconds}초</strong>

            <button
              type="button"
              onClick={() => onFrameIntervalChange(frameIntervalSeconds + 1)}
              disabled={isUploading}
            >
              +
            </button>
          </div>

          <p>값이 작을수록 더 많은 프레임이 저장됩니다.</p>
        </div>

        <div className="upload-setting-card">
          <span>저장 해상도</span>

          <select
            className="ui-select"
            value={targetWidth}
            onChange={(event) => onTargetWidthChange(event.target.value)}
            disabled={isUploading}
          >
            <option value="original">원본 유지</option>
            <option value="640">640px</option>
            <option value="960">960px</option>
            <option value="1280">1280px</option>
            <option value="1920">1920px</option>
          </select>

          <p>학습 속도와 저장 용량을 고려해 선택합니다.</p>
        </div>
      </div>

      <label className="upload-auto-label">
        <input
          type="checkbox"
          checked={autoLabel}
          onChange={(event) => onAutoLabelChange(event.target.checked)}
          disabled={isUploading}
        />

        <div>
          <strong>AI 자동 라벨링 실행</strong>
          <span>
            업로드 후 사전 분류 결과를 생성합니다. 현재는 추후 AI 연결을 위한 옵션입니다.
          </span>
        </div>
      </label>

      <button
        type="button"
        className="ui-button ui-button-primary ui-button-lg upload-submit-button"
        disabled={isUploading}
        onClick={onUpload}
      >
        {isUploading ? '업로드 및 프레임 추출 중...' : '영상 업로드 시작'}
      </button>
    </article>
  )
}

export default UploadSettingsGrid