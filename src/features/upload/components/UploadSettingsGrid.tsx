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
      <span className="ui-badge ui-badge-primary">
        Upload Settings
      </span>

      <h2>업로드 설정</h2>

      <div className="ui-form">

        <div className="ui-form-group">
          <label className="ui-label">
            프레임 추출 간격
          </label>

          <input
            className="ui-input"
            type="number"
            min={1}
            value={frameIntervalSeconds}
            onChange={(event) =>
              onFrameIntervalChange(Number(event.target.value))
            }
          />
        </div>

        <div className="ui-form-group">
          <label className="ui-label">
            저장 해상도
          </label>

          <select
            className="ui-select"
            value={targetWidth}
            onChange={(event) =>
              onTargetWidthChange(event.target.value)
            }
          >
            <option value="original">원본 유지</option>
            <option value="640">640px</option>
            <option value="960">960px</option>
            <option value="1280">1280px</option>
            <option value="1920">1920px</option>
          </select>
        </div>

        <label className="upload-checkbox">
          <input
            type="checkbox"
            checked={autoLabel}
            onChange={(event) =>
              onAutoLabelChange(event.target.checked)
            }
          />

          <span>AI 자동 라벨링 실행 (예정)</span>
        </label>

        <button
          type="button"
          className="ui-button ui-button-primary ui-button-lg"
          disabled={isUploading}
          onClick={onUpload}
        >
          {isUploading
            ? '업로드 중...'
            : '영상 업로드'}
        </button>

      </div>
    </article>
  )
}

export default UploadSettingsGrid