import { useEffect } from 'react'

import type { DatasetFrame } from '../../../../types/frame'
import type { LabelName } from '../../../../types/label'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type FrameModalProps = {
  datasetId: number
  frame: DatasetFrame
  frameIndex: number
  totalFrames: number
  labelOptions: LabelOption[]
  onClose: () => void
  onMove: (direction: 'prev' | 'next') => void
  onLabel: (frame: DatasetFrame, labelName: LabelName) => void
}

function getFrameLabel(frame: DatasetFrame): LabelName | null {
  return frame.labels?.[0]?.label_name ?? null
}

function formatTimestamp(timestamp: number | null) {
  if (timestamp === null || Number.isNaN(timestamp)) {
    return '0.0초'
  }

  return `${timestamp.toFixed(1)}초`
}

function FrameModal({
  datasetId,
  frame,
  frameIndex,
  totalFrames,
  labelOptions,
  onClose,
  onMove,
  onLabel,
}: FrameModalProps) {
  const currentLabel = getFrameLabel(frame)
  const currentLabelOption =
    labelOptions.find((option) => option.value === currentLabel) ?? null

  const isFirstFrame = frameIndex <= 0
  const isLastFrame = frameIndex >= totalFrames - 1

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        onMove('prev')
        return
      }

      if (event.key === 'ArrowRight') {
        onMove('next')
        return
      }

      const shortcutOption = labelOptions.find(
        (option) => option.shortcut.toLowerCase() === event.key.toLowerCase(),
      )

      if (shortcutOption) {
        onLabel(frame, shortcutOption.value)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [frame, labelOptions, onClose, onLabel, onMove])

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="frame-modal"
        role="dialog"
        aria-modal="true"
        aria-label="프레임 상세 보기"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="frame-modal-header">
          <div>
            <span className="ui-badge ui-badge-primary">
              Frame {frameIndex + 1} / {totalFrames}
            </span>

            <h2>Frame #{frame.frame_number}</h2>

            <p>{formatTimestamp(frame.timestamp)} 지점에서 추출된 프레임입니다.</p>
          </div>

          <button type="button" className="ui-icon-button" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="frame-modal-body">
          <main className="frame-modal-viewer">
            <img
              src={`/api/datasets/${datasetId}/frames/${frame.id}/image`}
              alt={`frame-${frame.id}`}
            />
          </main>

          <aside className="frame-modal-panel">
            <article className="frame-modal-card">
              <span className="ui-badge ui-badge-primary">현재 라벨</span>

              <h3>{currentLabelOption ? currentLabelOption.label : '미분류'}</h3>

              <p>단축키를 사용하면 빠르게 라벨을 지정할 수 있습니다.</p>
            </article>

            <article className="frame-modal-card">
              <h3>라벨 지정</h3>

              <div className="frame-modal-label-list">
                {labelOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`frame-modal-label-button ${option.className} ${
                      currentLabel === option.value ? 'active' : ''
                    }`}
                    onClick={() => onLabel(frame, option.value)}
                  >
                    <span>{option.shortcut}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </article>

            <article className="frame-modal-card">
              <h3>단축키</h3>

              <div className="frame-modal-shortcuts">
                <div>
                  <span className="ui-kbd">←</span>
                  <strong>이전 프레임</strong>
                </div>

                <div>
                  <span className="ui-kbd">→</span>
                  <strong>다음 프레임</strong>
                </div>

                <div>
                  <span className="ui-kbd">ESC</span>
                  <strong>닫기</strong>
                </div>

                {labelOptions.map((option) => (
                  <div key={option.value}>
                    <span className="ui-kbd">{option.shortcut}</span>
                    <strong>{option.label}</strong>
                  </div>
                ))}
              </div>
            </article>

            <div className="frame-modal-actions">
              <button
                type="button"
                className="ui-button ui-button-secondary"
                onClick={() => onMove('prev')}
                disabled={isFirstFrame}
              >
                이전
              </button>

              <button
                type="button"
                className="ui-button ui-button-primary"
                onClick={() => onMove('next')}
                disabled={isLastFrame}
              >
                다음
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default FrameModal