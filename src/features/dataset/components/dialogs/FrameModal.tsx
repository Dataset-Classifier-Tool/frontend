import { useEffect, useState } from 'react'

import {
  createBoundingBoxApi,
  deleteBoundingBoxApi,
  getFrameBoundingBoxesApi,
  updateBoundingBoxApi,
} from '../../api/boundingBoxApi'

import BoundingBoxCanvas from '../boundingBox/BoundingBoxCanvas'
import BoundingBoxPanel from '../boundingBox/BoundingBoxPanel'

import type {
  BoundingBox,
  CreateBoundingBoxRequest,
  UpdateBoundingBoxRequest,
} from '../../../../types/boundingBox'
import type { DatasetFrame } from '../../../../types/frame'
import type { LabelName } from '../../../../types/label'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type BoxDraft = Pick<BoundingBox, 'label_name' | 'x' | 'y' | 'width' | 'height'>

type BoxChange = Pick<BoundingBox, 'x' | 'y' | 'width' | 'height'>

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
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([])
  const [activeBoxLabel, setActiveBoxLabel] = useState<LabelName>('fire')
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null)
  const [isLoadingBoxes, setIsLoadingBoxes] = useState(false)
  const [isSavingBox, setIsSavingBox] = useState(false)
  const [boxErrorMessage, setBoxErrorMessage] = useState<string | null>(null)

  const currentLabel = getFrameLabel(frame)
  const currentLabelOption =
    labelOptions.find((option) => option.value === currentLabel) ?? null

  const isFirstFrame = frameIndex <= 0
  const isLastFrame = frameIndex >= totalFrames - 1

  useEffect(() => {
    let ignore = false

    async function loadBoundingBoxes() {
      setIsLoadingBoxes(true)
      setBoxErrorMessage(null)
      setSelectedBoxId(null)
      setActiveBoxLabel(currentLabel ?? 'fire')

      try {
        const response = await getFrameBoundingBoxesApi(frame.id)

        if (!ignore) {
          setBoundingBoxes(response.data)
        }
      } catch {
        if (!ignore) {
          setBoundingBoxes([])
          setBoxErrorMessage('Bounding Box를 불러오지 못했습니다.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingBoxes(false)
        }
      }
    }

    loadBoundingBoxes()

    return () => {
      ignore = true
    }
  }, [frame.id, currentLabel])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null

      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT'
      ) {
        return
      }

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
        setActiveBoxLabel(shortcutOption.value)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [frame, labelOptions, onClose, onLabel, onMove])

  const handleCreateBox = async (box: BoxDraft) => {
    if (isSavingBox) return

    setIsSavingBox(true)
    setBoxErrorMessage(null)

    const payload: CreateBoundingBoxRequest = {
      frame_id: frame.id,
      label_id: null,
      label_name: box.label_name,
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      source: 'manual',
      confidence: null,
      is_verified: true,
    }

    try {
      const response = await createBoundingBoxApi(payload)
      const createdBox = response.data

      setBoundingBoxes((prevBoxes) => [...prevBoxes, createdBox])
      setSelectedBoxId(createdBox.id)
    } catch {
      setBoxErrorMessage('Bounding Box 저장에 실패했습니다.')
    } finally {
      setIsSavingBox(false)
    }
  }

  const handleUpdateBox = async (boxId: number, box: BoxChange) => {
    const previousBoxes = boundingBoxes

    setBoundingBoxes((currentBoxes) =>
      currentBoxes.map((currentBox) =>
        currentBox.id === boxId
          ? {
              ...currentBox,
              ...box,
              source: 'manual',
              confidence: null,
              is_verified: true,
            }
          : currentBox,
      ),
    )

    const payload: UpdateBoundingBoxRequest = {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      source: 'manual',
      confidence: null,
      is_verified: true,
    }

    try {
      await updateBoundingBoxApi(boxId, payload)
    } catch {
      setBoundingBoxes(previousBoxes)
      setBoxErrorMessage('Bounding Box 수정에 실패했습니다.')
    }
  }

  const handleAssignLabel = async (boxId: number, label: LabelName) => {
    const previousBoxes = boundingBoxes

    setBoundingBoxes((boxes) =>
      boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              label_name: label,
              source: 'manual',
              confidence: null,
              is_verified: true,
            }
          : box,
      ),
    )

    try {
      await updateBoundingBoxApi(boxId, {
        label_name: label,
        source: 'manual',
        confidence: null,
        is_verified: true,
      })
    } catch {
      setBoundingBoxes(previousBoxes)
      setBoxErrorMessage('Bounding Box 라벨 수정에 실패했습니다.')
    }
  }

  const handleDeleteSelectedBox = async () => {
    if (selectedBoxId === null) return

    const targetBoxId = selectedBoxId
    const previousBoxes = boundingBoxes

    setBoundingBoxes((currentBoxes) =>
      currentBoxes.filter((box) => box.id !== targetBoxId),
    )
    setSelectedBoxId(null)
    setBoxErrorMessage(null)

    try {
      await deleteBoundingBoxApi(targetBoxId)
    } catch {
      setBoundingBoxes(previousBoxes)
      setSelectedBoxId(targetBoxId)
      setBoxErrorMessage('Bounding Box 삭제에 실패했습니다.')
    }
  }

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
            <div className="frame-modal-header-badges">
              <span className="ui-badge ui-badge-primary">
                Frame {frameIndex + 1} / {totalFrames}
              </span>

              <span
                className={`ui-badge ${
                  currentLabelOption ? currentLabelOption.className : ''
                }`}
              >
                {currentLabelOption ? currentLabelOption.label : '미분류'}
              </span>
            </div>

            <h2>Frame #{frame.frame_number}</h2>
            <p>{formatTimestamp(frame.timestamp)} 지점에서 추출된 프레임입니다.</p>
          </div>

          <button type="button" className="ui-icon-button" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="frame-modal-body">
          <main className="frame-modal-viewer">
            <BoundingBoxCanvas
              datasetId={datasetId}
              frameId={frame.id}
              imageAlt={`frame-${frame.id}`}
              boxes={boundingBoxes}
              activeLabel={activeBoxLabel}
              selectedBoxId={selectedBoxId}
              onCreateBox={handleCreateBox}
              onMoveBox={handleUpdateBox}
              onResizeBox={handleUpdateBox}
              onSelectBox={setSelectedBoxId}
              onDeleteSelectedBox={handleDeleteSelectedBox}
            />

            <div className="frame-modal-viewer-hint">
              <span className="ui-kbd">Drag</span>
              <span className="ui-kbd">Resize</span>
              <span className="ui-kbd">Delete</span>
              <span className="ui-kbd">F</span>
              <span className="ui-kbd">S</span>
              <span className="ui-kbd">C</span>
              <span className="ui-kbd">N</span>
              <strong>수정된 자동 박스는 Manual 검수 박스로 전환됩니다.</strong>
            </div>

            {(isLoadingBoxes || isSavingBox || boxErrorMessage) && (
              <div className="bbox-status">
                {isLoadingBoxes && <span>Bounding Box 불러오는 중...</span>}
                {isSavingBox && <span>Bounding Box 저장 중...</span>}
                {boxErrorMessage && <strong>{boxErrorMessage}</strong>}
              </div>
            )}
          </main>

          <aside className="frame-modal-panel">
            <article className="frame-modal-card frame-current-label-card">
              <span className="ui-badge ui-badge-primary">현재 프레임 라벨</span>

              <div className="frame-current-label">
                <div
                  className={`frame-current-label-icon ${
                    currentLabelOption ? currentLabelOption.className : ''
                  }`}
                >
                  {currentLabelOption ? currentLabelOption.shortcut : '?'}
                </div>

                <div>
                  <h3>
                    {currentLabelOption ? currentLabelOption.label : '미분류'}
                  </h3>
                  <p>
                    라벨 버튼을 클릭하거나 단축키를 누르면 프레임 라벨이 저장됩니다.
                  </p>
                </div>
              </div>
            </article>

            <article className="frame-modal-card">
              <div className="frame-modal-card-title-row">
                <div>
                  <span className="ui-badge ui-badge-primary">Frame Label</span>
                  <h3>프레임 라벨 지정</h3>
                </div>

                <span className="frame-modal-help-text">Click or press key</span>
              </div>

              <div className="frame-modal-label-list">
                {labelOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`frame-modal-label-button ${option.className} ${
                      currentLabel === option.value ? 'active' : ''
                    }`}
                    onClick={() => {
                      onLabel(frame, option.value)
                      setActiveBoxLabel(option.value)
                    }}
                  >
                    <span>{option.shortcut}</span>

                    <div>
                      <strong>{option.label}</strong>
                      <small>{option.shortcut} 키로 바로 지정</small>
                    </div>
                  </button>
                ))}
              </div>
            </article>

            <BoundingBoxPanel
              boxes={boundingBoxes}
              activeLabel={activeBoxLabel}
              selectedBoxId={selectedBoxId}
              onChangeActiveLabel={setActiveBoxLabel}
              onAssignLabelToBox={handleAssignLabel}
              onSelectBox={setSelectedBoxId}
              onDeleteSelectedBox={handleDeleteSelectedBox}
            />

            <article className="frame-modal-card">
              <div className="frame-modal-card-title-row">
                <div>
                  <span className="ui-badge ui-badge-primary">Shortcut</span>
                  <h3>단축키 안내</h3>
                </div>
              </div>

              <div className="frame-modal-shortcut-grid">
                {labelOptions.map((option) => (
                  <div key={option.value} className="frame-shortcut-item">
                    <span className="ui-kbd">{option.shortcut}</span>
                    <strong>{option.label}</strong>
                  </div>
                ))}

                <div className="frame-shortcut-item">
                  <span className="ui-kbd">←</span>
                  <strong>이전</strong>
                </div>

                <div className="frame-shortcut-item">
                  <span className="ui-kbd">→</span>
                  <strong>다음</strong>
                </div>

                <div className="frame-shortcut-item">
                  <span className="ui-kbd">DEL</span>
                  <strong>박스 삭제</strong>
                </div>

                <div className="frame-shortcut-item">
                  <span className="ui-kbd">ESC</span>
                  <strong>닫기</strong>
                </div>
              </div>
            </article>

            <article className="frame-modal-card">
              <span className="ui-badge ui-badge-primary">Navigation</span>

              <div className="frame-navigation-status">
                <strong>
                  {frameIndex + 1} / {totalFrames}
                </strong>
                <span>현재 페이지 내 프레임 이동</span>
              </div>

              <div className="frame-modal-actions">
                <button
                  type="button"
                  className="ui-button ui-button-secondary"
                  onClick={() => onMove('prev')}
                  disabled={isFirstFrame}
                >
                  ← 이전
                </button>

                <button
                  type="button"
                  className="ui-button ui-button-primary"
                  onClick={() => onMove('next')}
                  disabled={isLastFrame}
                >
                  다음 →
                </button>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default FrameModal