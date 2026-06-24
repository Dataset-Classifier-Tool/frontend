import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import {
  createBoundingBoxApi,
  getFrameBoundingBoxesApi,
} from '../../../common/api/boundingBoxApi'
import { getFrameImageUrl } from '../../../common/api/uploadApi'

import type { BoundingBox } from '../../../types/boundingBox'
import type { DatasetFrame } from '../../../types/frame'
import type { LabelName } from '../../../types/label'

interface Props {
  frame: DatasetFrame
  labelOptions: LabelName[]
  isLabelLoading: boolean
  selectedFrameIndex: number
  totalFrameCount: number
  onClose: () => void
  onMove: (direction: 'prev' | 'next') => void
  onCreateLabel: (frameId: number, labelName: LabelName) => void
  onDeleteLabel: (frameId: number, labelId: number) => void
  onError: (message: string) => void
}

const LABEL_TEXT: Record<LabelName, string> = {
  fire: '화재',
  smoke: '연기',
  carlight: '차량 등화류',
  negative: '정상',
  fire_smoke: '화재 + 연기',
  fire_smoke_carlight: '화재 + 연기 + 등화류',
}

const SHORTCUT_LABEL_MAP: Record<string, LabelName> = {
  f: 'fire',
  s: 'smoke',
  c: 'carlight',
  n: 'negative',
}

export function FrameModal({
  frame,
  labelOptions,
  isLabelLoading,
  selectedFrameIndex,
  totalFrameCount,
  onClose,
  onMove,
  onCreateLabel,
  onDeleteLabel,
  onError,
}: Props) {
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [boxes, setBoxes] = useState<BoundingBox[]>([])
  const [selectedBoxLabel, setSelectedBoxLabel] = useState<LabelName>('fire')

  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [drawPreview, setDrawPreview] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    getFrameBoundingBoxesApi(frame.id)
      .then((response) => setBoxes(response.data))
      .catch(() => setBoxes([]))
  }, [frame.id])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (key === 'escape') {
        onClose()
        return
      }

      if (key === 'arrowleft') {
        event.preventDefault()
        onMove('prev')
        return
      }

      if (key === 'arrowright') {
        event.preventDefault()
        onMove('next')
        return
      }

      const shortcutLabel = SHORTCUT_LABEL_MAP[key]

      if (shortcutLabel) {
        event.preventDefault()
        onCreateLabel(frame.id, shortcutLabel)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [frame.id, onClose, onMove, onCreateLabel])

  const boxStats = useMemo(() => {
    const stats: Record<LabelName | 'total', number> = {
      total: boxes.length,
      fire: 0,
      smoke: 0,
      carlight: 0,
      negative: 0,
      fire_smoke: 0,
      fire_smoke_carlight: 0,
    }

    boxes.forEach((box) => {
      stats[box.label_name] += 1
    })

    return stats
  }, [boxes])

  const getNormalizedPoint = (event: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return null

    const rect = imageRef.current.getBoundingClientRect()

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    return {
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    }
  }

  const handleBoxMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const point = getNormalizedPoint(event)
    if (!point) return

    setIsDrawing(true)
    setDrawStart(point)
    setDrawPreview({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    })
  }

  const handleBoxMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart) return

    const point = getNormalizedPoint(event)
    if (!point) return

    const x = Math.min(drawStart.x, point.x)
    const y = Math.min(drawStart.y, point.y)
    const width = Math.abs(point.x - drawStart.x)
    const height = Math.abs(point.y - drawStart.y)

    setDrawPreview({ x, y, width, height })
  }

  const handleBoxMouseUp = async () => {
    if (!drawPreview) return

    setIsDrawing(false)
    setDrawStart(null)

    if (drawPreview.width < 0.01 || drawPreview.height < 0.01) {
      setDrawPreview(null)
      return
    }

    try {
      const response = await createBoundingBoxApi({
        frame_id: frame.id,
        label_name: selectedBoxLabel,
        x: drawPreview.x,
        y: drawPreview.y,
        width: drawPreview.width,
        height: drawPreview.height,
      })

      setBoxes((prev) => [response.data, ...prev])
      setDrawPreview(null)
    } catch {
      onError('바운딩 박스 저장에 실패했습니다.')
      setDrawPreview(null)
    }
  }

  return (
    <div className="frame-modal-backdrop" onClick={onClose}>
      <div className="frame-modal" onClick={(event) => event.stopPropagation()}>
        <div className="frame-modal-header">
          <div>
            <h2>프레임 {frame.frame_number}</h2>
            <p>
              {frame.timestamp !== null
                ? `${frame.timestamp.toFixed(1)}초`
                : '시간 정보 없음'}
            </p>
          </div>

          <button type="button" className="text-button" onClick={onClose}>
            닫기
          </button>
        </div>

        <label>
          박스 라벨 선택
          <select
            value={selectedBoxLabel}
            onChange={(event) =>
              setSelectedBoxLabel(event.target.value as LabelName)
            }
          >
            {labelOptions.map((labelName) => (
              <option key={labelName} value={labelName}>
                {LABEL_TEXT[labelName]}
              </option>
            ))}
          </select>
        </label>

        <div className="box-stats-card">
          <span>현재 프레임 바운딩 박스</span>
          <strong>{boxStats.total}개</strong>

          {labelOptions.map((labelName) => (
            <small key={labelName}>
              {LABEL_TEXT[labelName]}: {boxStats[labelName]}개
            </small>
          ))}
        </div>

        <div
          className="box-draw-area"
          onMouseDown={handleBoxMouseDown}
          onMouseMove={handleBoxMouseMove}
          onMouseUp={handleBoxMouseUp}
        >
          <img
            ref={imageRef}
            className="frame-modal-image"
            src={getFrameImageUrl(frame.id)}
            alt={`프레임 ${frame.frame_number}`}
            draggable={false}
          />

          {boxes.map((box) => (
            <div
              key={box.id}
              className={
                box.source === 'ai'
                  ? 'box-overlay ai-box'
                  : 'box-overlay manual-box'
              }
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
              }}
            >
              <span className="box-label">
                {LABEL_TEXT[box.label_name]} ·{' '}
                {box.source === 'ai' ? 'AI' : '수동'}
              </span>
            </div>
          ))}

          {drawPreview && (
            <div
              className="box-overlay manual-box"
              style={{
                left: `${drawPreview.x * 100}%`,
                top: `${drawPreview.y * 100}%`,
                width: `${drawPreview.width * 100}%`,
                height: `${drawPreview.height * 100}%`,
              }}
            />
          )}
        </div>

        <div className="frame-modal-labels">
          {frame.labels.length === 0 ? (
            <span className="label-chip empty">미분류</span>
          ) : (
            frame.labels.map((label) => (
              <span className="label-chip removable" key={label.id}>
                {LABEL_TEXT[label.label_name]}
                <button
                  type="button"
                  className="label-remove-button"
                  onClick={() => onDeleteLabel(frame.id, label.id)}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        <div className="label-button-grid modal-label-grid">
          {labelOptions.map((labelName) => (
            <button
              key={labelName}
              type="button"
              className="label-button"
              disabled={isLabelLoading}
              onClick={() => onCreateLabel(frame.id, labelName)}
            >
              {LABEL_TEXT[labelName]}
            </button>
          ))}
        </div>

        <div className="frame-modal-actions">
          <button
            type="button"
            className="button secondary"
            disabled={selectedFrameIndex <= 0}
            onClick={() => onMove('prev')}
          >
            ← 이전 프레임
          </button>

          <button
            type="button"
            className="button primary"
            disabled={selectedFrameIndex >= totalFrameCount - 1}
            onClick={() => onMove('next')}
          >
            다음 프레임 →
          </button>
        </div>
      </div>
    </div>
  )
}