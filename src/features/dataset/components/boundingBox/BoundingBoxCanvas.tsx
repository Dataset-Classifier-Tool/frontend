import { useEffect, useMemo, useRef, useState } from 'react'

import FrameImage from '../FrameImage'

import type { BoundingBox } from '../../../../types/boundingBox'
import type { LabelName } from '../../../../types/label'

type BoxDraft = Pick<BoundingBox, 'label_name' | 'x' | 'y' | 'width' | 'height'>

type BoxChange = Pick<BoundingBox, 'x' | 'y' | 'width' | 'height'>

type ResizeMode = 'se' | null

type BoundingBoxCanvasProps = {
  datasetId: number
  frameId: number
  imageAlt: string
  boxes: BoundingBox[]
  activeLabel: LabelName
  selectedBoxId: number | null
  onCreateBox: (box: BoxDraft) => void
  onMoveBox: (boxId: number, box: BoxChange) => void
  onResizeBox: (boxId: number, box: BoxChange) => void
  onSelectBox: (boxId: number | null) => void
  onDeleteSelectedBox: () => void
}

type DrawState = {
  startX: number
  startY: number
  currentX: number
  currentY: number
}

type MoveState = {
  boxId: number
  offsetX: number
  offsetY: number
}

type ResizeState = {
  boxId: number
  mode: ResizeMode
}

const MIN_BOX_SIZE = 0.01

const LABEL_TEXT: Record<string, string> = {
  fire: '화재',
  smoke: '연기',
  carlight: '등화류',
  negative: '오탐',
  fire_smoke: '화재/연기',
  fire_smoke_carlight: '화재/연기/등화류',
}

const SOURCE_TEXT = {
  manual: 'Manual',
  ai: 'AI',
  mock: 'Mock',
} as const

function getLabelText(labelName: LabelName) {
  return LABEL_TEXT[labelName] ?? labelName
}

function getBoxMetaText(box: BoundingBox) {
  const sourceText = SOURCE_TEXT[box.source] ?? 'Manual'

  if (typeof box.confidence === 'number') {
    return `${sourceText} ${(box.confidence * 100).toFixed(0)}%`
  }

  return sourceText
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function roundRatio(value: number) {
  return Math.round(value * 10000) / 10000
}

function getPointerPosition(event: React.PointerEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect()

  return {
    x: Math.min(Math.max(event.clientX - rect.left, 0), rect.width),
    y: Math.min(Math.max(event.clientY - rect.top, 0), rect.height),
    rectWidth: rect.width,
    rectHeight: rect.height,
  }
}

function normalizeDraftBox(
  drawState: DrawState,
  rectWidth: number,
  rectHeight: number,
) {
  const x = Math.min(drawState.startX, drawState.currentX)
  const y = Math.min(drawState.startY, drawState.currentY)
  const width = Math.abs(drawState.currentX - drawState.startX)
  const height = Math.abs(drawState.currentY - drawState.startY)

  return {
    x: roundRatio(x / rectWidth),
    y: roundRatio(y / rectHeight),
    width: roundRatio(width / rectWidth),
    height: roundRatio(height / rectHeight),
  }
}

function toPercentStyle(box: Pick<BoundingBox, 'x' | 'y' | 'width' | 'height'>) {
  return {
    left: `${box.x * 100}%`,
    top: `${box.y * 100}%`,
    width: `${box.width * 100}%`,
    height: `${box.height * 100}%`,
  }
}

function BoundingBoxCanvas({
  datasetId,
  frameId,
  imageAlt,
  boxes,
  activeLabel,
  selectedBoxId,
  onCreateBox,
  onMoveBox,
  onResizeBox,
  onSelectBox,
  onDeleteSelectedBox,
}: BoundingBoxCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const [drawState, setDrawState] = useState<DrawState | null>(null)
  const [moveState, setMoveState] = useState<MoveState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)
  const [previewBoxes, setPreviewBoxes] = useState<Record<number, BoxChange>>({})

  const displayBoxes = useMemo(
    () =>
      boxes.map((box) => ({
        ...box,
        ...(previewBoxes[box.id] ?? {}),
      })),
    [boxes, previewBoxes],
  )

  const previewBox = useMemo(() => {
    if (!drawState || !canvasRef.current) return null

    const rect = canvasRef.current.getBoundingClientRect()

    return normalizeDraftBox(drawState, rect.width, rect.height)
  }, [drawState])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        onDeleteSelectedBox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onDeleteSelectedBox])

  const updatePreviewBox = (boxId: number, nextBox: BoxChange) => {
    setPreviewBoxes((prevBoxes) => ({
      ...prevBoxes,
      [boxId]: nextBox,
    }))
  }

  const clearPreviewBox = (boxId: number) => {
    setPreviewBoxes((prevBoxes) => {
      const nextBoxes = { ...prevBoxes }
      delete nextBoxes[boxId]

      return nextBoxes
    })
  }

  const findDisplayBox = (boxId: number) => {
    return displayBoxes.find((box) => box.id === boxId) ?? null
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    if (moveState || resizeState) return

    const position = getPointerPosition(event)

    event.currentTarget.setPointerCapture(event.pointerId)
    onSelectBox(null)

    setDrawState({
      startX: position.x,
      startY: position.y,
      currentX: position.x,
      currentY: position.y,
    })
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const position = getPointerPosition(event)

    if (moveState) {
      const targetBox = findDisplayBox(moveState.boxId)
      if (!targetBox) return

      const nextX = roundRatio(
        clamp(
          position.x / position.rectWidth - moveState.offsetX,
          0,
          1 - targetBox.width,
        ),
      )

      const nextY = roundRatio(
        clamp(
          position.y / position.rectHeight - moveState.offsetY,
          0,
          1 - targetBox.height,
        ),
      )

      updatePreviewBox(moveState.boxId, {
        x: nextX,
        y: nextY,
        width: targetBox.width,
        height: targetBox.height,
      })

      return
    }

    if (resizeState) {
      const targetBox = findDisplayBox(resizeState.boxId)
      if (!targetBox) return

      const pointerX = clamp(position.x / position.rectWidth, 0, 1)
      const pointerY = clamp(position.y / position.rectHeight, 0, 1)

      const nextWidth = roundRatio(
        clamp(pointerX - targetBox.x, MIN_BOX_SIZE, 1 - targetBox.x),
      )

      const nextHeight = roundRatio(
        clamp(pointerY - targetBox.y, MIN_BOX_SIZE, 1 - targetBox.y),
      )

      updatePreviewBox(resizeState.boxId, {
        x: targetBox.x,
        y: targetBox.y,
        width: nextWidth,
        height: nextHeight,
      })

      return
    }

    if (!drawState) return

    setDrawState((prevState) => {
      if (!prevState) return prevState

      return {
        ...prevState,
        currentX: position.x,
        currentY: position.y,
      }
    })
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (moveState) {
      const changedBox = previewBoxes[moveState.boxId]

      if (changedBox) {
        onMoveBox(moveState.boxId, changedBox)
        clearPreviewBox(moveState.boxId)
      }

      setMoveState(null)

      return
    }

    if (resizeState) {
      const changedBox = previewBoxes[resizeState.boxId]

      if (changedBox) {
        onResizeBox(resizeState.boxId, changedBox)
        clearPreviewBox(resizeState.boxId)
      }

      setResizeState(null)

      return
    }

    if (!drawState) return

    const position = getPointerPosition(event)

    const nextDrawState = {
      ...drawState,
      currentX: position.x,
      currentY: position.y,
    }

    const box = normalizeDraftBox(
      nextDrawState,
      position.rectWidth,
      position.rectHeight,
    )

    setDrawState(null)

    if (box.width < MIN_BOX_SIZE || box.height < MIN_BOX_SIZE) {
      return
    }

    onCreateBox({
      label_name: activeLabel,
      ...box,
    })
  }

  const handlePointerCancel = () => {
    setDrawState(null)
    setMoveState(null)
    setResizeState(null)
    setPreviewBoxes({})
  }

  const handleBoxPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    box: BoundingBox,
  ) => {
    event.stopPropagation()

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const pointerX = (event.clientX - rect.left) / rect.width
    const pointerY = (event.clientY - rect.top) / rect.height

    onSelectBox(box.id)
    setDrawState(null)
    setResizeState(null)
    setMoveState({
      boxId: box.id,
      offsetX: pointerX - box.x,
      offsetY: pointerY - box.y,
    })
  }

  const handleResizePointerDown = (
    event: React.PointerEvent<HTMLSpanElement>,
    box: BoundingBox,
  ) => {
    event.stopPropagation()

    onSelectBox(box.id)
    setDrawState(null)
    setMoveState(null)
    setResizeState({
      boxId: box.id,
      mode: 'se',
    })
  }

  return (
    <div className="bbox-stage">
      <div
        ref={canvasRef}
        className="bbox-canvas"
        role="presentation"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <FrameImage datasetId={datasetId} frameId={frameId} alt={imageAlt} />

        {displayBoxes.map((box) => (
          <button
            key={box.id}
            type="button"
            className={`bbox-box bbox-box-${box.label_name} ${
              selectedBoxId === box.id ? 'active' : ''
            }`}
            style={toPercentStyle(box)}
            onPointerDown={(event) => handleBoxPointerDown(event, box)}
          >
            <span>
              {getLabelText(box.label_name)}
              <small>{getBoxMetaText(box)}</small>
            </span>

            {selectedBoxId === box.id && (
              <span
                className="bbox-resize-handle bbox-resize-handle-se"
                role="presentation"
                onPointerDown={(event) => handleResizePointerDown(event, box)}
              />
            )}
          </button>
        ))}

        {previewBox && (
          <div
            className={`bbox-box bbox-box-preview bbox-box-${activeLabel}`}
            style={toPercentStyle(previewBox)}
          >
            <span>{getLabelText(activeLabel)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoundingBoxCanvas